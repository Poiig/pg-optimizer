/**
 * 界面文案。分类内部 key 仍用中文，和计算器输出保持一致。
 */

export const translations = {
	zh: {
		title: 'PostgreSQL 参数优化',
		subtitle: '按 CPU、内存、磁盘类型生成 OLTP 配置 · PG 13–18',

		serverConfig: '服务器配置',
		dbVersion: 'PostgreSQL 版本',
		workloadNote: '按 OLTP 事务库思路生成，与历史 PG13 基线一致。',
		cpuCores: 'CPU 核心数',
		memoryGB: '内存 (GB)',
		storageType: '存储类型',
		ssd: 'SATA / SAS SSD',
		nvme: '本地 NVMe',
		hdd: '机械硬盘 (HDD)',
		raidDataDisks: 'RAID 数据盘块数',
		raidDataDisksHint: '只数数据盘，不含校验盘。留空按单盘 HDD：查询 2、维护 2。',
		placeholderRaidDisks: '例如: 8',
		generateConfig: '生成配置',
		placeholderCpu: '例如: 8',
		placeholderMemory: '例如: 32',
		formHint: '修改任意项会立即重新计算。推荐值按所选版本的官方语义给出。',

		generatedParams: '推荐配置',
		copyConfig: '复制 postgresql.conf',
		previewSQL: '复制 ALTER SYSTEM',
		confTitle: 'postgresql.conf',
		sqlTitle: 'ALTER SYSTEM',

		overview: '配置概要',
		statTotal: '参数总数',
		statRestart: '需重启',
		filterLabel: '筛选',
		searchPlaceholder: '搜索参数名或说明',
		filterAll: '全部',
		onlyRestart: '仅看需重启',
		showing: '显示',
		noMatch: '没有匹配的参数',
		resetFilter: '重置筛选',

		copy: '复制',
		close: '关闭',
		linesSuffix: '行',
		paramsSuffix: '个参数',
		autoCopied: '内容已自动复制到剪贴板，也可以用下面的按钮再复制一次。',

		diskProbe: '磁盘类型实测',
		diskProbeCta: '不确定？用脚本实测 →',
		storageHint: '探测脚本结论是 NVMe / SSD / HDD 时，分别选对应项。HDD 做了 RAID 再填数据盘块数。',
		diskProbeHint: '在数据库所在机器上跑 4KB 随机读，按 IOPS 和延迟分位数判定磁盘类型。',
		diskProbeNotes: '说明',
		diskProbeDeps: '压测依赖 fio；解析结果会在 jq、python3、awk 中挑一个可用的，因此没装 jq 也能跑。',
		diskProbeInstall: '有 root 或免密 sudo 时会询问是否自动安装依赖；没有权限就加 --no-install，脚本只打印需要执行的安装命令。',
		diskProbeDir: '用 -d 指定 PGDATA 所在目录才测得准；测试文件默认 4G、跑完自动删除，空间不足时用 -s 1G。',
		diskProbeMap: '脚本结论是 NVMe、SSD 或 HDD，就在页面里选对应项。',
		viewScript: '在 GitHub 查看脚本',

		github: 'GitHub',
		repoLink: '查看源码仓库',
		footerDisclaimer: '生成结果是调优起点，上线前请结合真实负载压测验证。',
		footerDocs: 'PostgreSQL 官方文档',
		footerIssues: '反馈问题',
		footerLicense: 'MIT License',

		paramName: '参数名',
		paramValue: '参数值',
		restartRequired: '重启',
		versionRange: '版本',
		description: '说明',
		yes: '是',
		no: '否',

		copied: '已复制',
		copyFailed: '复制失败，请手动复制',
		noParams: '没有可复制的配置参数，请先生成配置',
		viewDoc: '查看官方文档',
		viewDocLink: '官方文档 →',

		confHint: '写入 postgresql.conf 后，对标记为「需重启」的参数执行重启；其余可 SELECT pg_reload_conf()。',
		sqlHint: 'ALTER SYSTEM 写入 postgresql.auto.conf。需重启的参数仍然要重启实例才能生效。',
		paramDescriptionDefault: '该参数的详细说明请参考 PostgreSQL 官方文档',

		logAdded: '本版新增',
		logChanged: '官方变更',
		logRemoved: '本版移除',
		logExpand: '展开官方变更',
		logCollapse: '收起官方变更',
		logEmpty: '这一版没有需要单独说明的调优级 GUC 增删。',

		sourceNote: '以上是 PostgreSQL 官方相对上一主版本的参数变化，不是本工具推荐值的对照。'
	},
	en: {
		title: 'PostgreSQL Parameter Optimizer',
		subtitle: 'OLTP settings from CPU, memory and disk type · PG 13–18',

		serverConfig: 'Server configuration',
		dbVersion: 'PostgreSQL version',
		workloadNote: 'Generated for OLTP, matching the historical PostgreSQL 13 baseline.',
		cpuCores: 'CPU cores',
		memoryGB: 'Memory (GB)',
		storageType: 'Storage',
		ssd: 'SATA / SAS SSD',
		nvme: 'Local NVMe',
		hdd: 'HDD',
		raidDataDisks: 'RAID data disks',
		raidDataDisksHint: 'Count data disks only, not parity. Leave empty for a single HDD: query 2, maintenance 2.',
		placeholderRaidDisks: 'e.g. 8',
		generateConfig: 'Generate',
		placeholderCpu: 'e.g. 8',
		placeholderMemory: 'e.g. 32',
		formHint: 'Changes recalculate immediately. Recommended values follow the official semantics of the selected version.',

		generatedParams: 'Recommended settings',
		copyConfig: 'Copy postgresql.conf',
		previewSQL: 'Copy ALTER SYSTEM',
		confTitle: 'postgresql.conf',
		sqlTitle: 'ALTER SYSTEM',

		overview: 'Overview',
		statTotal: 'Parameters',
		statRestart: 'Need restart',
		filterLabel: 'Filter',
		searchPlaceholder: 'Search name or description',
		filterAll: 'All',
		onlyRestart: 'Restart only',
		showing: 'Showing',
		noMatch: 'No matching parameters',
		resetFilter: 'Reset filters',

		copy: 'Copy',
		close: 'Close',
		linesSuffix: 'lines',
		paramsSuffix: 'parameters',
		autoCopied: 'Already copied to your clipboard. Use the button below to copy again.',

		diskProbe: 'Detect disk type',
		diskProbeCta: 'Not sure? Measure it →',
		storageHint: 'Map the probe result to NVMe, SSD or HDD. For HDD RAID, also fill in the data-disk count.',
		diskProbeHint: 'Runs a 4KB random read on the database host and classifies the disk by IOPS and latency percentiles.',
		diskProbeNotes: 'Notes',
		diskProbeDeps: 'The benchmark needs fio. Parsing falls back through jq, python3 and awk, so a missing jq is not a blocker.',
		diskProbeInstall: 'With root or passwordless sudo the script offers to install dependencies. Without those privileges pass --no-install and it only prints the install command.',
		diskProbeDir: 'Point -d at the directory holding PGDATA. The 4G test file is removed afterwards; use -s 1G when space is tight.',
		diskProbeMap: 'Pick NVMe, SSD or HDD to match the script’s conclusion.',
		viewScript: 'View the script on GitHub',

		github: 'GitHub',
		repoLink: 'Open the source repository',
		footerDisclaimer: 'These values are a starting point. Validate them with your real workload before rollout.',
		footerDocs: 'PostgreSQL documentation',
		footerIssues: 'Report an issue',
		footerLicense: 'MIT License',

		paramName: 'Name',
		paramValue: 'Value',
		restartRequired: 'Restart',
		versionRange: 'Version',
		description: 'Description',
		yes: 'Yes',
		no: 'No',

		copied: 'Copied',
		copyFailed: 'Copy failed, please copy manually',
		noParams: 'No parameters to copy yet',
		viewDoc: 'Official documentation',
		viewDocLink: 'Docs →',

		confHint: 'Put these lines in postgresql.conf. Restart for restart-required parameters; others can use SELECT pg_reload_conf().',
		sqlHint: 'ALTER SYSTEM writes postgresql.auto.conf. Restart-required parameters still need a restart.',
		paramDescriptionDefault: 'See the PostgreSQL documentation for details',

		logAdded: 'Added in this release',
		logChanged: 'Official change',
		logRemoved: 'Removed in this release',
		logExpand: 'Show official changes',
		logCollapse: 'Hide official changes',
		logEmpty: 'This release has no tuning-level GUC additions or removals to call out.',

		sourceNote: 'These are official PostgreSQL changes versus the previous major version, not a comparison of this tool’s recommended values.'
	}
}

export const categoryMap = {
	'性能相关参数': {
		zh: '性能相关参数',
		en: 'Performance'
	},
	'自动清理相关配置': {
		zh: '自动清理相关配置',
		en: 'Autovacuum'
	},
	'超时相关': {
		zh: '超时相关',
		en: 'Timeouts'
	},
	'日志记录相关': {
		zh: '日志记录相关',
		en: 'Logging'
	},
	'其他参数': {
		zh: '其他参数',
		en: 'Other'
	}
}

export function getCategoryName(category, lang = 'zh') {
	return categoryMap[category]?.[lang] || category
}

export function t(key, lang = 'zh') {
	return translations[lang]?.[key] || key
}

const WARNING_KEY_MAP = {}

export function getWarningText(warningId, lang = 'zh') {
	const key = WARNING_KEY_MAP[warningId]
	return key ? t(key, lang) : warningId
}
