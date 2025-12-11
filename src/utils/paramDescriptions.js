/**
 * PostgreSQL 参数说明
 * 提供每个参数的详细说明
 */

export const paramDescriptions = {
	// Autovacuum 相关参数
	'autovacuum': '启用自动清理进程，自动清理和更新表统计信息',
	'autovacuum_analyze_scale_factor': '触发自动分析的表大小比例因子',
	'autovacuum_analyze_threshold': '触发自动分析的最小变更行数',
	'autovacuum_naptime': '自动清理进程的休眠间隔（秒）',
	'autovacuum_vacuum_cost_delay': '自动清理的延迟时间（毫秒）',
	'autovacuum_vacuum_cost_limit': '自动清理的成本限制',
	'autovacuum_vacuum_scale_factor': '触发自动清理的表大小比例因子',
	'autovacuum_vacuum_threshold': '触发自动清理的最小变更行数',
	'log_autovacuum_min_duration': '记录自动清理操作的最小执行时间（毫秒）',
	'autovacuum_freeze_max_age': '事务ID冻结的最大年龄',
	'autovacuum_multixact_freeze_max_age': '多事务ID冻结的最大年龄',
	'autovacuum_max_workers': '同时运行的自动清理工作进程的最大数量',
	'autovacuum_work_mem': '每个自动清理工作进程使用的内存大小',
	'vacuum_cleanup_index_scale_factor': '清理索引时的比例因子',
	'vacuum_cost_limit': '手动清理的成本限制',
	'vacuum_cost_delay': '手动清理的延迟时间（毫秒）',
	'vacuum_cost_page_dirty': '清理脏页的成本',
	'vacuum_cost_page_hit': '清理缓存页的成本',
	'vacuum_cost_page_miss': '清理未缓存页的成本',
	'vacuum_defer_cleanup_age': '延迟清理的事务年龄',
	'vacuum_freeze_min_age': '事务ID冻结的最小年龄',
	'vacuum_freeze_table_age': '表冻结的年龄阈值',
	'vacuum_multixact_freeze_min_age': '多事务ID冻结的最小年龄',
	'vacuum_multixact_freeze_table_age': '多事务表冻结的年龄阈值',

	// WAL 相关参数
	'wal_sender_timeout': 'WAL发送超时时间',
	'wal_compression': '是否启用WAL压缩',
	'jit': '是否启用即时编译（JIT）',
	'wal_buffers': 'WAL缓冲区大小',
	'wal_keep_size': '保留的WAL文件大小',
	'wal_writer_flush_after': 'WAL写入器刷新阈值',
	'min_wal_size': 'WAL文件的最小大小',
	'max_wal_size': 'WAL文件的最大大小',

	// 连接和超时相关参数
	'idle_in_transaction_session_timeout': '空闲事务会话超时时间',
	'statement_timeout': '语句执行超时时间',
	'tcp_keepalives_count': 'TCP keepalive 探测次数',
	'tcp_keepalives_idle': 'TCP keepalive 空闲时间（秒）',
	'tcp_keepalives_interval': 'TCP keepalive 探测间隔（秒）',

	// 核心性能参数
	'max_connections': '最大并发连接数',
	'shared_buffers': '共享缓冲区大小，用于缓存数据页',
	'effective_cache_size': '可用于磁盘缓存的估计内存大小',
	'maintenance_work_mem': '维护操作（如VACUUM、CREATE INDEX）使用的内存',
	'checkpoint_completion_target': '检查点完成目标（0.0-1.0）',
	'checkpoint_timeout': '检查点超时时间',
	'default_statistics_target': '默认统计信息收集目标',
	'random_page_cost': '随机页面读取的成本估计',
	'effective_io_concurrency': '有效的并发I/O操作数',
	'work_mem': '每个查询操作使用的内存大小',
	'huge_pages': '是否使用大页内存',

	// 并行处理相关参数
	'max_worker_processes': '最大工作进程数',
	'max_parallel_workers_per_gather': '每个Gather节点允许的最大并行工作进程数',
	'max_parallel_workers': '最大并行工作进程数',
	'max_parallel_maintenance_workers': '最大并行维护工作进程数',

	// Background writer 相关参数
	'bgwriter_lru_maxpages': '后台写入器每次写入的最大页面数',
	'bgwriter_lru_multiplier': '后台写入器的LRU乘数',

	// 其他优化参数
	'enable_partitionwise_aggregate': '是否启用分区聚合',
	'enable_partitionwise_join': '是否启用分区连接',
	'extra_float_digits': '浮点数显示的额外精度位数',
	'max_wal_senders': '最大WAL发送进程数',
	'superuser_reserved_connections': '为超级用户保留的连接数',
	'temp_file_limit': '临时文件大小限制',
	'track_functions': '跟踪函数调用的级别',
	'track_io_timing': '是否跟踪I/O操作时间',
	'TimeZone': '服务器时区',
	'max_replication_slots': '最大复制槽数',
	'max_stack_depth': '最大堆栈深度（KB）',
	'lc_messages': '消息区域设置',

	// 日志相关参数
	'log_destination': '日志输出目标',
	'logging_collector': '是否启用日志收集器',
	'log_directory': '日志文件目录',
	'log_filename': '日志文件名模式',
	'log_truncate_on_rotation': '日志轮转时是否截断',
	'log_min_messages': '记录的最小消息级别',
	'log_checkpoints': '是否记录检查点',
	'log_lock_waits': '是否记录锁等待',
	'log_connections': '是否记录连接',
	'log_disconnections': '是否记录断开连接',
	'log_line_prefix': '日志行前缀格式',
	'log_timezone': '日志时区',
	'log_min_duration_statement': '记录慢查询的最小执行时间',
	'log_temp_files': '记录临时文件的最小大小',
	'log_min_duration_sample': '采样记录的最小执行时间',
	'log_statement_sample_rate': '语句采样率'
}

/**
 * 获取参数的官方文档链接
 * @param {string} paramName - 参数名
 * @param {string} dbVersion - PostgreSQL版本
 * @returns {string} 官方文档链接
 */
export function getParamDocUrl(paramName, dbVersion = '13') {
	const baseUrl = `https://www.postgresql.org/docs/${dbVersion}/runtime-config`

	// 根据参数类型分类到不同的文档页面
	if (paramName.startsWith('autovacuum') || paramName.startsWith('vacuum')) {
		return `${baseUrl}-autovacuum.html#${paramName.replace(/_/g, '-')}`
	} else if (paramName.startsWith('wal_') || paramName.startsWith('max_wal_') || paramName.startsWith('min_wal_')) {
		return `${baseUrl}-wal.html#${paramName.replace(/_/g, '-')}`
	} else if (paramName.startsWith('log_') || paramName === 'logging_collector' || paramName === 'log_destination') {
		return `${baseUrl}-logging.html#${paramName.replace(/_/g, '-')}`
	} else if (paramName.startsWith('max_') || paramName.startsWith('shared_') || paramName === 'work_mem' ||
		paramName === 'maintenance_work_mem' || paramName === 'effective_cache_size') {
		return `${baseUrl}-resource.html#${paramName.replace(/_/g, '-')}`
	} else if (paramName.startsWith('max_parallel') || paramName === 'max_worker_processes') {
		return `${baseUrl}-resource.html#${paramName.replace(/_/g, '-')}`
	} else if (paramName.includes('timeout') || paramName.includes('TimeZone')) {
		return `${baseUrl}-client.html#${paramName.replace(/_/g, '-')}`
	} else {
		// 默认搜索链接
		return `https://www.postgresql.org/docs/${dbVersion}/runtime-config.html`
	}
}

/**
 * 获取参数的说明
 * @param {string} paramName - 参数名
 * @returns {string} 参数说明，如果不存在则返回默认说明
 */
export function getParamDescription(paramName) {
	return paramDescriptions[paramName] || '该参数的详细说明请参考 PostgreSQL 官方文档'
}

