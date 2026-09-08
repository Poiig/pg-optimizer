# PostgreSQL 性能参数优化工具

一个基于 Vue 3 的 PostgreSQL 性能参数自动优化工具，根据服务器配置（CPU核心数、内存大小、存储类型）自动生成优化的 PostgreSQL 配置参数。

**官网：<https://pg-optimizer.poiig.top/>** — 无需安装，打开即用。

## 📸 系统运行截图

### 主界面
![主界面](screenshots/main.png)
*左侧填写版本、CPU、内存和存储类型（SSD / NVMe / HDD），右侧即时给出推荐配置*

### 生成的配置参数
![配置参数](screenshots/params.png)
*参数按类别筛选，表格含取值、是否需重启、版本徽章和说明，可直接改值*

### 功能演示
![功能演示](screenshots/features.png)
*点 postgresql.conf 或 ALTER SYSTEM 会弹窗展示全文，核对后再复制*

## ✨ 功能特性

- 🎯 **智能参数计算**: 根据服务器配置自动计算优化的 PostgreSQL 参数
- 📊 **多版本支持**: 覆盖 PostgreSQL 13–18，13 沿用生产基线公式，14–18 只补充官方新增或语义变化的参数
- 💾 **存储类型优化**: 支持 SSD 和机械硬盘两种存储类型，自动调整 I/O 相关参数
- 🔬 **磁盘类型实测**: 附带 `detect_disk_type.sh`，用 fio 压测结果决定该选 SSD 还是 HDD
- 📋 **一键复制**: 复制时弹窗展示 postgresql.conf 与 ALTER SYSTEM 全文，可核对后再粘贴
- 🔍 **搜索与筛选**: 按参数名、取值、说明搜索，可按分类或"需重启"过滤
- 📖 **参数说明**: 每个参数都有详细说明和对应版本的官方文档链接
- 🔄 **重启提示**: 明确标识哪些参数需要重启服务才能生效

## 🛠️ 技术栈

- **Vue 3** (Composition API)
- **Vite** (构建工具)
- **原生 CSS** (样式)

## 🚀 一键部署

### 使用 Cloudflare Pages 部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages)

#### 环境要求
- Node.js 18+
- npm（或 pnpm/yarn，对应修改命令）

#### 1. Fork 本仓库
将此项目 Fork 到你自己的 GitHub 账户下。

#### 2. 创建 Cloudflare Pages 项目
* 登录 Cloudflare 控制台，进入 `Workers & Pages`。
* 选择“创建应用程式” -> “Pages” -> “连结到 Git”。
* 选择你刚刚 Fork 的仓库。
* 在 **“设定组建和部署”** 页面，构建设定如下：
  * **框架预设**: `None`
  * **构建命令**: `npm run build`
  * **构建输出目录**: `dist`  ← 重要，Vite 默认输出目录
  * **环境变量**: 默认无需配置（如需自定义 API，可在此添加）

#### 3. 确认生产分支
默认使用 `main`；如有自定义分支，请在 Pages “来源”里切换。

#### 4. 部署
保存后将自动构建并部署，稍等几分钟即可访问。

#### Pages 配置检查清单
- ✅ 构建命令为 `npm run build`
- ✅ 构建输出目录为 `dist`
- ✅ 生产分支选择正确（默认 `main`）
- ✅ 无需 Workers 绑定或 KV/R2 依赖
- ✅ 需要自定义域名时，记得在 Pages 完成域名绑定和 DNS 生效

![Cloudflare Pages](screenshots/DeployCloudflare.png)

### 使用 Docker 部署

```bash
# 构建镜像
docker build -t pg-optimizer .

# 运行容器（默认 80 端口）
docker run -d --name pg-optimizer -p 8080:80 pg-optimizer
```

说明：
- 基于 `nginx:alpine` 托管构建产物，默认监听 80 端口。
- 已包含 `try_files` 回退到 `index.html`，支持前端路由刷新不 404。
- 如需自定义缓存/HTTPS，请替换 `docker/nginx.conf` 后重新构建。

### 使用 Docker Compose 部署

```bash
# 前台启动（默认映射 8080 到容器 80）
docker-compose up

# 后台启动
docker-compose up -d

# 停止并清理
docker-compose down
```

## 📦 本地安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动（支持通过 IP 地址访问）

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📖 使用方法

1. 选择 PostgreSQL 版本（13–18）
2. 输入 CPU 核心数（例如：8）
3. 输入内存大小（GB，例如：32）
4. 选择存储类型（SSD 或机械硬盘），不确定时用下面的脚本实测
5. 参数会随输入实时重算，也可以点"生成配置"手动触发
6. 需要微调时直接在表格里改参数值，复制出来的内容会同步
7. 点"复制 postgresql.conf"或"复制 ALTER SYSTEM"，内容进剪贴板同时弹窗展示全文

## 🔬 磁盘类型实测

云盘的规格页不一定反映真实性能，`effective_io_concurrency`、`random_page_cost` 又依赖存储类型，所以提供了一个压测脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/Poiig/pg-optimizer/main/detect_disk_type.sh -o detect_disk_type.sh
bash detect_disk_type.sh -d /var/lib/postgresql/data
```

脚本跑 4KB 随机读，按 IOPS 和延迟分位数判定 HDD / SSD / NVMe，结论是 NVMe 或 SSD 就在页面里选 SSD。

| 选项 | 说明 |
| --- | --- |
| `-d DIR` | 测试目录，指到 PGDATA 所在的盘才准（默认当前目录） |
| `-s SIZE` | 测试文件大小，默认 `4G`，空间不够用 `-s 1G` |
| `-t SEC` | 压测时长，默认 20 秒 |
| `--no-install` | 不自动装依赖，只打印需要执行的安装命令 |
| `-y` | 自动安装依赖时不再询问 |

依赖方面：压测本身需要 `fio`；解析结果会在 `jq`、`python3`、`awk` 之间挑一个可用的，所以没装 `jq` 也能跑完。有 root 或免密 sudo 时脚本会询问是否自动安装，没有权限就用 `--no-install` 拿到手动安装命令。测试文件跑完自动删除，文件系统不支持 `O_DIRECT`（overlayfs、tmpfs）时会降级为带缓存读并在结论里标注。

## 🔢 参数算法说明

工具根据以下算法自动计算 PostgreSQL 性能参数。所有内存相关的计算都基于用户输入的内存大小（GB）转换为字节进行计算。

### 基础计算

- **DBInstanceClassMemory** = 内存(GB) × 1024 × 1024 × 1024（转换为字节）
- **memoryMB** = 内存(GB) × 1024（转换为MB）

### 核心性能参数

#### 1. max_connections（最大连接数）
```
max_connections = CPU核心数 × 200
```
**说明**: 根据 CPU 核心数动态调整，确保有足够的连接数支持并发访问。

#### 2. shared_buffers（共享缓冲区）
```
shared_buffers = DBInstanceClassMemory / 4
```
**说明**: 设置为内存的 1/4，这是 PostgreSQL 最重要的性能参数之一，用于缓存数据页。

#### 3. effective_cache_size（有效缓存大小）
```
effective_cache_size = DBInstanceClassMemory × 3 / 4
```
**说明**: 设置为总内存的 3/4，用于查询规划器估算可用缓存，影响查询计划选择。例如 32GB 内存计算结果为 24GB。

#### 4. work_mem（工作内存）
```
work_mem = GREATEST(DBInstanceClassMemory / 4194304, 4096)
结果单位: KB
```
**说明**: 每个查询操作（排序、哈希、合并连接等）使用的内存大小。例如 32GB 内存计算结果为 8192KB。

#### 5. maintenance_work_mem（维护工作内存）
```
maintenance_work_mem = LEAST(DBInstanceClassMemory / 65536, 4194304)
结果单位: KB
```
**说明**: 维护操作（如 VACUUM、CREATE INDEX）使用的内存。例如 32GB 内存计算结果为 524288KB。

#### 6. wal_buffers（WAL 缓冲区）
```
wal_buffers = min(2047MB, shared_buffers / 32)
```
**说明**: WAL 缓冲区大小，用于缓存 WAL 数据。例如 shared_buffers 是 16GB，则 wal_buffers = min(2047MB, 512MB) = 512MB。

#### 7. min_wal_size（最小 WAL 大小）
```
min_wal_size = LEAST(GREATEST(DBInstanceClassMemory / 8388608, 256), 8192)
结果单位: MB
```
**说明**: WAL 文件不会缩小到此值以下。例如 32GB 内存计算结果为 4096MB。

#### 8. max_wal_size（最大 WAL 大小）
```
max_wal_size = LEAST(GREATEST(DBInstanceClassMemory / 2097152, 2048), 16384)
结果单位: MB
```
**说明**: 当 WAL 大小超过此值时，会强制触发检查点。例如 32GB 内存计算结果为 16384MB。

#### 9. temp_file_limit（临时文件限制）
```
temp_file_limit = DBInstanceClassMemory / 1024
结果单位: KB
```
**说明**: 限制单个会话可以使用的临时文件大小。例如 32GB 内存计算结果为 33554432KB。

### 并行处理参数

#### 10. max_worker_processes（最大工作进程数）
```
max_worker_processes = CPU核心数 × 2
```
**说明**: 限制后台工作进程的总数。

#### 11. max_parallel_workers_per_gather（每个 Gather 节点的最大并行工作进程数）
```
max_parallel_workers_per_gather = GREATEST(CPU核心数 / 2, 2)
```
**说明**: 控制单个查询的并行度。

#### 12. max_parallel_workers（最大并行工作进程数）
```
max_parallel_workers = GREATEST(CPU核心数 × 3 / 4, 8)
```
**说明**: 限制所有并行查询的总工作进程数。

#### 13. max_parallel_maintenance_workers（最大并行维护工作进程数）
```
max_parallel_maintenance_workers = GREATEST(CPU核心数 / 2, 2)
```
**说明**: 用于 CREATE INDEX、VACUUM 等维护操作的并行执行。

### 自动清理参数

#### 14. autovacuum_max_workers（最大自动清理工作进程数）
```
autovacuum_max_workers = LEAST(GREATEST(DBInstanceClassMemory / 17179869184, 3), 10)
```
**说明**: 17179869184 = 16GB，根据内存大小动态调整，范围在 3-10 之间。

#### 15. autovacuum_work_mem（自动清理工作内存）
```
autovacuum_work_mem = GREATEST(DBInstanceClassMemory / 65536, 131072)
结果单位: KB
```
**说明**: 每个自动清理工作进程使用的内存大小，用于存储死元组 ID，最大有效值为 1GB。

### I/O 相关参数（根据存储类型）

#### 16. random_page_cost（随机页面读取成本）
- **SSD**: `1.1`
- **HDD**: `4.0`

**说明**: 用于查询规划器估算随机 I/O 的成本。SSD 的随机读取性能接近顺序读取，因此成本较低。

#### 17. effective_io_concurrency（有效并发 I/O 操作数）
- **默认值**: `1`（所有环境统一使用此默认值）

**说明**: 用于查询规划器估算并发 I/O 能力。

**<span style="color: red; font-weight: bold;">建议值说明：</span>**
- **<span style="color: red; font-weight: bold;">虚拟机环境：</span>** 使用默认值 `1`
- **<span style="color: red; font-weight: bold;">物理磁盘 SSD：</span>** 建议设置为 `200`
- **<span style="color: red; font-weight: bold;">物理磁盘 HDD：</span>** 建议设置为 `4`

### 其他固定参数

- **checkpoint_timeout**: `15min` - 检查点超时时间
- **checkpoint_completion_target**: `0.9` - 检查点完成目标
- **bgwriter_lru_multiplier**: `2` - 后台写入器的 LRU 乘数
- **wal_compression**: `on` - 启用 WAL 压缩
- **jit**: `off` - 关闭 JIT 编译（可根据需要调整）

### 智能单位选择

工具会自动选择最合适的单位（GB、MB、KB）来显示内存相关的参数值：
- 如果能表示为整数 GB，则使用 GB
- 如果能表示为整数 MB，则使用 MB
- 否则使用 KB

例如：
- `shared_buffers`: 8GB（8GB 内存时）
- `wal_buffers`: 512MB（32GB 内存时）
- `work_mem`: 8192KB（32GB 内存时）

## 📝 参数分组

生成的参数按以下类别分组：

1. **性能相关参数**: 核心性能参数，如 shared_buffers、work_mem、并行处理参数等
2. **自动清理相关配置**: autovacuum 和 vacuum 相关参数
3. **超时相关**: 连接和语句超时参数
4. **日志记录相关**: 日志配置参数
5. **其他参数**: 其他优化参数

## 🔄 参数重启要求

表格「重启」列按官方 GUC context 标注：只有 `postmaster`（文档写 *can only be set at server start*）才标「是」。

本工具会输出且需要重启的参数：

- **全版本**：`shared_buffers`、`wal_buffers`、`max_connections`、`huge_pages`、`max_worker_processes`、`logging_collector`、`autovacuum_freeze_max_age`、`autovacuum_multixact_freeze_max_age`
- **PG13–17**：`autovacuum_max_workers`
- **PG18**：改为 `autovacuum_worker_slots` 需重启；`autovacuum_max_workers` 只要槽位够，`pg_reload_conf()` 即可

其余推荐项（含 `jit`、并行度、autovacuum 阈值/配额、checkpoint、日志级别）都是 SIGHUP 或会话级，reload 或 `SET` 即可，不必重启。

## 📚 参数说明

每个参数都包含：
- **详细说明**: 参数的作用和用途
- **官方文档链接**: 点击参数名旁边的链接图标可查看 PostgreSQL 官方文档
- **悬停提示**: 鼠标悬停在"?"图标上可查看参数说明

## 🎯 使用建议

1. **首次使用**: 建议先在测试环境验证生成的参数
2. **参数调整**: 可以根据实际业务需求手动调整参数值
3. **重启参数**: 修改需要重启的参数后，需要重启 PostgreSQL 服务
4. **监控调整**: 使用生成的参数后，建议监控数据库性能，根据实际情况调整

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🌐 在线演示

官网（Cloudflare Pages 部署）：<https://pg-optimizer.poiig.top/>

纯前端计算，不上传任何服务器信息，也不需要连接数据库。

## 📞 联系方式

如有问题或建议，请提交 Issue。
