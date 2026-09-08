#!/usr/bin/env bash
#
# 磁盘类型探测：用 4KB 随机读的 IOPS 与延迟分位数判定 HDD / SSD / NVMe，
# 输出可直接填进 pg-optimizer 的存储类型。
#
# 只依赖 fio 做压测，JSON 解析在 jq / python3 / awk 之间自动挑一个可用的，
# 因此在没有 jq、没有 bc、没有 root 的最小化机器上也能跑完。
#
# 用法: bash detect_disk_type.sh [-d 目录] [-s 大小] [-t 秒数] [--no-install] [-y]

set -uo pipefail

TARGET_DIR="$(pwd)"
TEST_SIZE="4G"
RUNTIME=20
AUTO_INSTALL=1
ASSUME_YES=0

usage() {
	cat <<EOF
用法: bash $(basename "$0") [选项]

选项:
  -d, --dir DIR      测试目录，应与 PGDATA 在同一块盘上（默认: 当前目录）
  -s, --size SIZE    测试文件大小，需大于内存缓存影响范围（默认: 4G）
  -t, --time SEC     压测时长秒数（默认: 20）
      --no-install   缺少依赖时只提示命令，不自动安装
  -y, --yes          自动安装依赖时不再询问
  -h, --help         显示帮助

示例:
  bash $(basename "$0") -d /var/lib/pgsql -s 2G
EOF
}

while [ $# -gt 0 ]; do
	case "$1" in
		-d|--dir) TARGET_DIR="${2:-}"; shift 2 ;;
		-s|--size) TEST_SIZE="${2:-}"; shift 2 ;;
		-t|--time) RUNTIME="${2:-}"; shift 2 ;;
		--no-install) AUTO_INSTALL=0; shift ;;
		-y|--yes) ASSUME_YES=1; shift ;;
		-h|--help) usage; exit 0 ;;
		*) echo "未知参数: $1" >&2; usage >&2; exit 2 ;;
	esac
done

die() {
	echo "错误: $*" >&2
	exit 1
}

# 包管理器差异集中在一处，新增发行版只改这里。
detect_pkg_manager() {
	for pm in apt-get dnf yum zypper pacman apk; do
		if command -v "$pm" >/dev/null 2>&1; then
			echo "$pm"
			return 0
		fi
	done
	return 1
}

install_hint() {
	local pkgs="$*"
	local pm
	pm="$(detect_pkg_manager)" || { echo "  请用系统包管理器安装: $pkgs"; return; }
	case "$pm" in
		apt-get) echo "  sudo apt-get update && sudo apt-get install -y $pkgs" ;;
		dnf) echo "  sudo dnf install -y $pkgs" ;;
		yum) echo "  sudo yum install -y epel-release && sudo yum install -y $pkgs" ;;
		zypper) echo "  sudo zypper install -y $pkgs" ;;
		pacman) echo "  sudo pacman -S --noconfirm $pkgs" ;;
		apk) echo "  sudo apk add $pkgs" ;;
	esac
}

# 没有 root 也没有 sudo 时直接放弃安装，避免卡在密码提示上。
privileged_runner() {
	if [ "$(id -u)" -eq 0 ]; then
		echo ""
		return 0
	fi
	if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
		echo "sudo"
		return 0
	fi
	return 1
}

try_install() {
	local pkgs="$*"
	local pm runner
	pm="$(detect_pkg_manager)" || return 1
	runner="$(privileged_runner)" || return 1

	if [ "$ASSUME_YES" -eq 0 ]; then
		printf "缺少依赖 %s，现在安装吗? [y/N] " "$pkgs"
		read -r reply </dev/tty 2>/dev/null || reply="n"
		case "$reply" in
			[yY]*) ;;
			*) return 1 ;;
		esac
	fi

	case "$pm" in
		apt-get) $runner apt-get update -y && $runner apt-get install -y $pkgs ;;
		dnf) $runner dnf install -y $pkgs ;;
		yum) $runner yum install -y epel-release; $runner yum install -y $pkgs ;;
		zypper) $runner zypper install -y $pkgs ;;
		pacman) $runner pacman -S --noconfirm $pkgs ;;
		apk) $runner apk add $pkgs ;;
	esac
}

ensure_fio() {
	command -v fio >/dev/null 2>&1 && return 0

	if [ "$AUTO_INSTALL" -eq 1 ] && try_install fio && command -v fio >/dev/null 2>&1; then
		return 0
	fi

	echo "未找到 fio，本脚本无法在不压测的情况下判定磁盘类型。" >&2
	echo "请先安装 fio:" >&2
	install_hint fio >&2
	exit 1
}

# JSON 解析器三选一：jq 最准，python3 次之，awk 兜底只够取扁平数值字段，
# 用于 jq/python3 都缺失且不允许安装的场景。
pick_json_parser() {
	if command -v jq >/dev/null 2>&1; then
		echo "jq"
	elif command -v python3 >/dev/null 2>&1; then
		echo "python3"
	elif command -v python >/dev/null 2>&1; then
		echo "python"
	else
		echo "awk"
	fi
}

JSON_PARSER=""

# 取值路径用 | 分隔而不是点号，因为 percentile 的 key 本身就叫 "95.000000"，
# 点号分隔会把它拆成两段。取不到值时统一输出空串。
json_read() {
	local path="$1"
	case "$JSON_PARSER" in
		jq)
			local filter=".jobs[0].read"
			local key
			local IFS='|'
			for key in $path; do
				filter="${filter}[\"${key}\"]"
			done
			jq -r "try ($filter) // empty" "$FIO_JSON" 2>/dev/null
			;;
		python3|python)
			PROBE_PATH="$path" PROBE_JSON="$FIO_JSON" "$JSON_PARSER" -c '
import json, os, sys
try:
    node = json.load(open(os.environ["PROBE_JSON"]))["jobs"][0]["read"]
except Exception:
    sys.exit(0)
for key in os.environ["PROBE_PATH"].split("|"):
    if not isinstance(node, dict) or key not in node:
        sys.exit(0)
    node = node[key]
print(node)
' 2>/dev/null
			;;
		awk)
			# mean 这类 key 在 slat/clat/lat 各段里重复出现，所以先等父级 key 出现再取叶子，
			# 依赖 fio 的多行 JSON 排版，精度不如 jq。
			local leaf="${path##*|}"
			local rest="${path%|*}"
			local parent=""
			[ "$rest" != "$path" ] && parent="${rest##*|}"
			awk -v parent="$parent" -v leaf="$leaf" '
				parent != "" && index($0, "\"" parent "\"") { inblock = 1 }
				(inblock || parent == "") &&
				match($0, "\"" leaf "\"[[:space:]]*:[[:space:]]*[0-9.eE+-]+") {
					seg = substr($0, RSTART, RLENGTH)
					sub(/^.*:[[:space:]]*/, "", seg)
					print seg
					exit
				}' "$FIO_JSON" 2>/dev/null
			;;
	esac
}

# 浮点运算全部交给 awk，避免依赖 bc（最小化系统常常没装）。
calc() {
	awk "BEGIN { printf \"%.3f\", $1 }"
}

# 返回 0 表示条件成立，用于替代 shell 的整数比较。
cmp_float() {
	awk "BEGIN { exit !($1) }"
}

ensure_fio

[ -d "$TARGET_DIR" ] || die "目录不存在: $TARGET_DIR"
[ -w "$TARGET_DIR" ] || die "目录不可写: $TARGET_DIR"

TEST_FILE="$TARGET_DIR/.fio_disk_probe.$$"
FIO_JSON="$(mktemp -t fio_probe.XXXXXX)" || die "无法创建临时文件"

cleanup() {
	rm -f "$TEST_FILE" "$FIO_JSON"
}
trap cleanup EXIT INT TERM

# 空间不足时 fio 会中途报错，提前换算成 MB 比较，顺手提示改小 -s。
check_free_space() {
	local size_mb avail_mb
	size_mb="$(awk -v s="$TEST_SIZE" 'BEGIN {
		n = s + 0
		unit = toupper(substr(s, length(s)))
		if (unit == "G") n = n * 1024
		else if (unit == "K") n = n / 1024
		else if (unit == "M") n = n
		printf "%.0f", n
	}')"
	avail_mb="$(df -Pm "$TARGET_DIR" 2>/dev/null | awk 'NR==2 {print $4}')"
	[ -n "$avail_mb" ] || return 0
	if [ "$avail_mb" -lt "$size_mb" ]; then
		die "$TARGET_DIR 可用空间 ${avail_mb}MB，小于测试文件 ${size_mb}MB。用 -s 调小，例如 -s 1G"
	fi
}

check_free_space

# io_uring 在旧内核上编译进了 fio 也可能运行失败，因此逐个实测而不是只看 --enghelp。
# direct=1 在 overlayfs/tmpfs 上不被支持，失败后降级为带缓存读，并在结论里标注。
DIRECT=1
IOENGINE=""

probe_engine() {
	local engine="$1"
	fio --name=probe --filename="$TEST_FILE" --size=8M --bs=4k --rw=randread \
		--ioengine="$engine" --direct="$DIRECT" --runtime=1 --time_based \
		--output-format=json >/dev/null 2>&1
}

select_engine() {
	local candidates="io_uring libaio psync sync"
	for engine in $candidates; do
		fio --enghelp 2>/dev/null | grep -qw "$engine" || continue
		if probe_engine "$engine"; then
			IOENGINE="$engine"
			return 0
		fi
	done
	return 1
}

echo "==== 环境 ===="
echo "测试目录: $TARGET_DIR"
echo "测试文件: ${TEST_SIZE}, 时长 ${RUNTIME}s"

if ! select_engine; then
	DIRECT=0
	if ! select_engine; then
		die "fio 无法在 $TARGET_DIR 上完成任何 IO 引擎的试跑，请检查文件系统权限"
	fi
	echo "提示: 该文件系统不支持 O_DIRECT，已降级为带缓存读，结果会偏乐观"
fi

JSON_PARSER="$(pick_json_parser)"
if [ "$JSON_PARSER" = "awk" ] && [ "$AUTO_INSTALL" -eq 1 ]; then
	if try_install jq && command -v jq >/dev/null 2>&1; then
		JSON_PARSER="jq"
	fi
fi
if [ "$JSON_PARSER" = "awk" ]; then
	echo "提示: 未找到 jq / python3，改用 awk 解析结果，延迟分位数可能取不到。装上 jq 更准:" >&2
	install_hint jq >&2
fi

echo "IO 引擎: $IOENGINE (direct=$DIRECT), JSON 解析: $JSON_PARSER"
echo ""
echo "==== 压测 ===="
echo "正在跑 4KB 随机读..."

if ! fio --name=randread_probe \
	--filename="$TEST_FILE" \
	--size="$TEST_SIZE" \
	--bs=4k \
	--iodepth=32 \
	--rw=randread \
	--direct="$DIRECT" \
	--numjobs=1 \
	--runtime="$RUNTIME" \
	--time_based \
	--ioengine="$IOENGINE" \
	--output-format=json >"$FIO_JSON" 2>/dev/null; then
	die "fio 压测失败，可用 fio --debug=io 手动排查"
fi

IOPS="$(json_read 'iops')"
[ -n "$IOPS" ] || die "无法从 fio 输出解析 IOPS"
IOPS="$(calc "$IOPS")"

# fio 3.x 用 lat_ns，2.x 只有 lat_us，两者都尝试后统一换算成毫秒。
read_latency_ms() {
	local ns_path="$1" us_path="$2" value
	value="$(json_read "$ns_path")"
	if [ -n "$value" ]; then
		calc "$value / 1000000"
		return
	fi
	value="$(json_read "$us_path")"
	if [ -n "$value" ]; then
		calc "$value / 1000"
		return
	fi
	echo ""
}

LAT_AVG_MS="$(read_latency_ms 'lat_ns|mean' 'lat_us|mean')"
LAT_P95_MS="$(read_latency_ms 'clat_ns|percentile|95.000000' 'clat_us|percentile|95.000000')"
LAT_P99_MS="$(read_latency_ms 'clat_ns|percentile|99.000000' 'clat_us|percentile|99.000000')"

echo ""
echo "==== 指标 ===="
printf "随机读 IOPS: %s\n" "$IOPS"
printf "平均延迟: %s ms\n" "${LAT_AVG_MS:-未取到}"
printf "P95 延迟: %s ms\n" "${LAT_P95_MS:-未取到}"
printf "P99 延迟: %s ms\n" "${LAT_P99_MS:-未取到}"

# 指标缺失时不参与判定：超限判断返回假，达标判断也返回假，
# 于是缺延迟数据的机器既不会被误判成 HDD，也不会被拔高到 NVMe。
lat_exceeds() {
	local value="$1" limit="$2"
	[ -n "$value" ] || return 1
	cmp_float "$value > $limit"
}

lat_below() {
	local value="$1" limit="$2"
	[ -n "$value" ] || return 1
	cmp_float "$value < $limit"
}

if cmp_float "$IOPS < 2000" || lat_exceeds "$LAT_AVG_MS" 3 || lat_exceeds "$LAT_P95_MS" 10 || lat_exceeds "$LAT_P99_MS" 20; then
	DISK_TYPE="HDD"
	PG_STORAGE="hdd"
elif cmp_float "$IOPS > 30000" && lat_below "$LAT_AVG_MS" 1 && lat_below "$LAT_P99_MS" 2; then
	DISK_TYPE="NVMe"
	PG_STORAGE="ssd"
else
	DISK_TYPE="SSD"
	PG_STORAGE="ssd"
fi

echo ""
echo "==== 结论 ===="
echo "磁盘类型: $DISK_TYPE"
echo "pg-optimizer 存储类型请选: $(echo "$PG_STORAGE" | tr '[:lower:]' '[:upper:]')"
echo "PG_OPTIMIZER_STORAGE_TYPE=$PG_STORAGE"
if [ "$DIRECT" -eq 0 ]; then
	echo "注意: 本次为带缓存读，若结果偏好请在支持 O_DIRECT 的目录复测"
fi
