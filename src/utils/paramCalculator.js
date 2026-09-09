/**
 * 按 CPU、内存、存储类型计算 PostgreSQL 参数。
 * 各版本按官方语义给值；13 沿用云厂商 RDS 公式，发现问题后再改。
 */


/**
 * 优先用整数 GB/MB，避免配置文件里出现难读的超大 kB。
 */
function formatMemorySize(bytes) {
	const gb = bytes / 1024 / 1024 / 1024
	if (gb >= 1 && gb % 1 === 0) {
		return `${gb}GB`
	}

	const mb = bytes / 1024 / 1024
	if (mb >= 1 && mb % 1 === 0) {
		return `${mb}MB`
	}

	const kb = bytes / 1024
	if (kb >= 1 && kb % 1 === 0) {
		return `${kb}kB`
	}

	return `${kb.toFixed(2)}kB`
}

/**
 * 从 KB 起步选择可读单位。
 */
function formatMemorySizeFromKB(kb) {
	const gb = kb / 1024 / 1024
	if (gb >= 1 && gb % 1 === 0) {
		return `${gb}GB`
	}

	const mb = kb / 1024
	if (mb >= 1 && mb % 1 === 0) {
		return `${mb}MB`
	}

	if (kb % 1 === 0) {
		return `${kb}kB`
	}

	return `${kb.toFixed(2)}kB`
}

/**
 * 从 MB 起步选择可读单位。
 */
function formatMemorySizeFromMB(mb) {
	const gb = mb / 1024
	if (gb >= 1 && gb % 1 === 0) {
		return `${gb}GB`
	}

	if (mb % 1 === 0) {
		return `${mb}MB`
	}

	return `${mb.toFixed(2)}MB`
}

/**
 * 把表单里的存储选项收成三档。旧书签或脚本只传 ssd 时按 SATA/SAS SSD 处理，避免 NVMe 队列被低估。
 */
function normalizeStorageType(storageType) {
	if (storageType === 'hdd') {
		return 'hdd'
	}
	if (storageType === 'nvme') {
		return 'nvme'
	}
	return 'ssd'
}

/**
 * 查询 / 维护两条预读并发按介质给。HDD RAID 只数数据盘，校验盘不贡献随机 IOPS。
 */
function ioConcurrencyForStorage(storageType, raidDataDisks) {
	if (storageType === 'hdd') {
		const dataDisks = Number(raidDataDisks)
		if (Number.isFinite(dataDisks) && dataDisks >= 2) {
			return { query: dataDisks, maintenance: dataDisks }
		}
		return { query: 2, maintenance: 2 }
	}
	if (storageType === 'nvme') {
		return { query: 200, maintenance: 64 }
	}
	return { query: 128, maintenance: 64 }
}

/**
 * 计算推荐参数。
 * since/until 记录参数在官方的存在区间（事实，用于版本徽章），from 记录本工具从哪个版本
 * 开始给出推荐值。两者分开是因为有些参数官方很早就有，但 13 的生产基线没纳入，
 * 若混用一个字段，徽章会把「我们从 14 开始推荐」误报成「PG14 才有这个参数」。
 */
export function calculateParams(config) {
	const dbVersion = parseInt(config.dbVersion, 10) || 13
	const cpuCores = Number(config.cpuCores) || 0
	const memoryGB = Number(config.memoryGB) || 0
	const storageType = normalizeStorageType(config.storageType)

	const DBInstanceClassMemory = memoryGB * 1024 * 1024 * 1024
	const params = []
	const warnings = []

	const addParam = (name, value, category, options = {}) => {
		const since = options.since ?? 13
		const until = options.until ?? null
		const from = options.from ?? since
		if (dbVersion < from || (until !== null && dbVersion > until)) {
			return
		}
		params.push({
			name,
			value: String(value),
			category,
			since,
			until
		})
	}

	const autovacuumCategory = '自动清理相关配置'
	// 13 只按内存 16GB 一档；14 起把核数也算进来：多租户实例的表和索引数量远超单库，
	// 清理进度通常先卡在 worker 数上，而 worker 是真实进程，用核数的一半兜住上限。
	const workersByMemory = Math.floor(DBInstanceClassMemory / 17179869184)
	const autovacuumMaxWorkers = dbVersion >= 14
		? Math.min(Math.max(workersByMemory, Math.floor(cpuCores / 2), 3), 10)
		: Math.min(Math.max(workersByMemory, 3), 10)

	addParam('autovacuum', 'on', autovacuumCategory)
	addParam('autovacuum_analyze_scale_factor', '0.05', autovacuumCategory)
	addParam('autovacuum_analyze_threshold', '50', autovacuumCategory)
	addParam('autovacuum_naptime', '15', autovacuumCategory)
	addParam('autovacuum_vacuum_cost_delay', '2', autovacuumCategory)
	// 总配额由正在跑的 worker 平分。按「每人维持官方默认 200」放大，
	// 避免加 worker 后人均变慢；满员时总 I/O 仍远低于云厂商常见的 10000。
	addParam('autovacuum_vacuum_cost_limit', String(autovacuumMaxWorkers * 200), autovacuumCategory)
	addParam('autovacuum_vacuum_scale_factor', '0.05', autovacuumCategory)
	addParam('autovacuum_vacuum_threshold', '50', autovacuumCategory)
	addParam('log_autovacuum_min_duration', '5s', autovacuumCategory)
	addParam('autovacuum_freeze_max_age', '200000000', autovacuumCategory)
	addParam('autovacuum_multixact_freeze_max_age', '400000000', autovacuumCategory)

	addParam('autovacuum_max_workers', autovacuumMaxWorkers.toString(), autovacuumCategory)
	// PG18 把 worker 池拆成两层：slots 需重启才能改，max_workers 可 reload。
	// 槽位不低于官方默认的 16，否则线上想临时加大 max_workers 会因为槽位不足而无效。
	addParam('autovacuum_worker_slots', Math.max(autovacuumMaxWorkers, 16).toString(), autovacuumCategory, { since: 18 })

	// 公式跟 maintenance_work_mem 同源；死元组收集超过 1GB 无效或会被 worker 数放大，统一封顶。
	const autovacuumWorkMemKB = Math.min(Math.max(Math.floor(DBInstanceClassMemory / 65536), 131072), 1048576)
	addParam('autovacuum_work_mem', formatMemorySizeFromKB(autovacuumWorkMemKB), autovacuumCategory)

	addParam('vacuum_cleanup_index_scale_factor', '0.1', autovacuumCategory, { until: 13 })
	addParam('vacuum_cost_limit', '10000', autovacuumCategory)
	addParam('vacuum_cost_delay', '0', autovacuumCategory)
	addParam('vacuum_cost_page_dirty', '20', autovacuumCategory)
	addParam('vacuum_cost_page_hit', '1', autovacuumCategory)
	addParam('vacuum_cost_page_miss', '2', autovacuumCategory)
	addParam('vacuum_defer_cleanup_age', '0', autovacuumCategory, { until: 15 })
	addParam('vacuum_freeze_min_age', '50000000', autovacuumCategory)
	// 跟官方默认 1.5 亿对齐；设到 2 亿会被钳到 freeze_max_age 的 95%，没有额外收益。
	addParam('vacuum_freeze_table_age', '150000000', autovacuumCategory)
	addParam('vacuum_multixact_freeze_min_age', '5000000', autovacuumCategory)
	addParam('vacuum_multixact_freeze_table_age', '150000000', autovacuumCategory)
	// PG16 默认 256kB 偏小，跟 PG17 官方默认对齐到 2MB，限制 vacuum 挤占缓存。
	addParam('vacuum_buffer_usage_limit', '2MB', autovacuumCategory, { since: 16 })
	// 比例因子 0.05 在亿行级的租户表上要攒到 500 万死元组才触发，18 起用新参数给它封顶。
	addParam('autovacuum_vacuum_max_threshold', '50000000', autovacuumCategory, { since: 18 })

	const performanceCategory = '性能相关参数'
	addParam('wal_sender_timeout', '5min', performanceCategory)
	if (dbVersion >= 15) {
		addParam('wal_compression', 'lz4', performanceCategory)
	} else {
		addParam('wal_compression', 'on', performanceCategory)
	}
	addParam('jit', 'off', performanceCategory)

	const maxConnections = cpuCores * 200
	addParam('max_connections', maxConnections.toString(), performanceCategory)

	const sharedBuffersBytes = DBInstanceClassMemory / 4
	addParam('shared_buffers', formatMemorySize(sharedBuffersBytes), performanceCategory)

	const effectiveCacheSizeBytes = DBInstanceClassMemory * 3 / 4
	addParam('effective_cache_size', formatMemorySize(effectiveCacheSizeBytes), performanceCategory)

	const maintenanceWorkMemKB = Math.min(Math.floor(DBInstanceClassMemory / 65536), 4194304)
	addParam('maintenance_work_mem', formatMemorySizeFromKB(maintenanceWorkMemKB), performanceCategory)

	addParam('checkpoint_completion_target', '0.9', performanceCategory)

	// 官方自动值就是 shared_buffers/32，且说明超过一个 WAL 段（通常 16MB）几乎没有收益。
	const walBuffersBytes = Math.min(sharedBuffersBytes / 32, 16 * 1024 * 1024)
	addParam('wal_buffers', formatMemorySize(walBuffersBytes), performanceCategory)

	addParam('checkpoint_timeout', '15min', performanceCategory)
	addParam('default_statistics_target', '100', performanceCategory)

	addParam('random_page_cost', storageType === 'hdd' ? '4' : '1.1', performanceCategory)
	const ioConcurrency = ioConcurrencyForStorage(storageType, config.raidDataDisks)
	addParam('effective_io_concurrency', ioConcurrency.query.toString(), performanceCategory)
	addParam('maintenance_io_concurrency', ioConcurrency.maintenance.toString(), performanceCategory)

	const workMemKB = Math.max(Math.floor(DBInstanceClassMemory / 4194304), 4096)
	addParam('work_mem', formatMemorySizeFromKB(workMemKB), performanceCategory)
	addParam('hash_mem_multiplier', '2.0', performanceCategory)

	addParam('huge_pages', 'try', performanceCategory)

	const minWalSizeMB = Math.min(Math.max(Math.floor(DBInstanceClassMemory / 8388608), 256), 8192)
	addParam('min_wal_size', formatMemorySizeFromMB(minWalSizeMB), performanceCategory)

	const maxWalSizeMB = Math.min(Math.max(Math.floor(DBInstanceClassMemory / 2097152), 2048), 16384)
	addParam('max_wal_size', formatMemorySizeFromMB(maxWalSizeMB), performanceCategory)

	// 4 核以下并行收益不稳定，交给官方默认；4 核起才按规格写这组参数。
	if (cpuCores >= 4) {
		const maxWorkerProcesses = cpuCores * 2
		addParam('max_worker_processes', maxWorkerProcesses.toString(), performanceCategory)
		const maxParallelWorkersPerGather = dbVersion >= 14 ? 2 : Math.max(Math.floor(cpuCores / 2), 2)
		addParam('max_parallel_workers_per_gather', maxParallelWorkersPerGather.toString(), performanceCategory)
		let maxParallelWorkers = Math.max(Math.floor(cpuCores * 3 / 4), 8)
		if (dbVersion >= 14) {
			maxParallelWorkers = Math.min(maxParallelWorkers, maxWorkerProcesses)
		}
		addParam('max_parallel_workers', maxParallelWorkers.toString(), performanceCategory)
		const maxParallelMaintenanceWorkers = Math.max(Math.floor(cpuCores / 2), 2)
		addParam('max_parallel_maintenance_workers', maxParallelMaintenanceWorkers.toString(), performanceCategory)
	}

	addParam('bgwriter_lru_maxpages', '1000', performanceCategory)
	addParam('bgwriter_lru_multiplier', '2', performanceCategory)

	addParam('enable_partitionwise_aggregate', 'on', performanceCategory)
	addParam('enable_partitionwise_join', 'on', performanceCategory)
	addParam('extra_float_digits', '3', performanceCategory)

	const tempFileLimitKB = Math.floor(DBInstanceClassMemory / 1024)
	addParam('temp_file_limit', formatMemorySizeFromKB(tempFileLimitKB), performanceCategory)

	addParam('track_io_timing', 'on', performanceCategory)
	addParam('track_wal_io_timing', 'on', performanceCategory, { since: 14 })
	addParam('compute_query_id', 'auto', performanceCategory, { since: 14 })

	const timeoutCategory = '超时相关'
	addParam('idle_in_transaction_session_timeout', '6min', timeoutCategory)
	addParam('idle_session_timeout', '10min', timeoutCategory, { since: 14 })
	addParam('statement_timeout', '5min', timeoutCategory)
	addParam('client_connection_check_interval', '10s', timeoutCategory, { since: 14 })
	addParam('tcp_keepalives_count', '10', timeoutCategory)
	addParam('tcp_keepalives_idle', '45', timeoutCategory)
	addParam('tcp_keepalives_interval', '10', timeoutCategory)

	const loggingCategory = '日志记录相关'
	addParam('log_destination', 'stderr', loggingCategory)
	addParam('logging_collector', 'on', loggingCategory)
	addParam('log_directory', 'pg_log', loggingCategory)
	addParam('log_filename', 'postgresql-%m-%d.log', loggingCategory)
	addParam('log_truncate_on_rotation', 'on', loggingCategory)
	// NOTICE 会把隐式建索引、序列重名之类的客户端提示全写进服务端日志，
	// 多租户下量很大且排障价值低，14 起回到官方默认 WARNING。
	addParam('log_min_messages', dbVersion >= 14 ? 'WARNING' : 'NOTICE', loggingCategory)
	addParam('log_checkpoints', 'on', loggingCategory)
	addParam('log_lock_waits', 'on', loggingCategory)
	addParam('log_connections', 'off', loggingCategory)
	addParam('log_disconnections', 'off', loggingCategory)
	addParam('log_line_prefix', '%m [%p][%a] %u %d %r ', loggingCategory)
	addParam('log_timezone', 'Asia/Shanghai', loggingCategory)
	addParam('log_min_duration_statement', '5000ms', loggingCategory)
	// 裸数字按官方默认单位 kB 解析，写成 MB 避免和「字节」搞混；10MB 能较早暴露 work_mem 溢写。
	addParam('log_temp_files', '10MB', loggingCategory)
	addParam('log_min_duration_sample', '500ms', loggingCategory)
	addParam('log_statement_sample_rate', '0.2', loggingCategory)
	addParam('lc_messages', 'en_US.UTF-8', loggingCategory)

	return { params, warnings }
}
