/**
 * PostgreSQL 参数说明
 * 提供每个参数的详细说明
 */

export const paramDescriptions = {
	// Autovacuum 相关参数
	'autovacuum': '启用自动清理进程，自动清理和更新表统计信息',
	'autovacuum_analyze_scale_factor': '触发自动分析的表大小比例因子。当表大小变化超过此比例时触发自动分析。',
	'autovacuum_analyze_threshold': '触发自动分析的最小变更行数。当表变更行数超过此阈值时触发自动分析。',
	'autovacuum_naptime': '自动清理进程的休眠间隔（秒）。控制自动清理进程检查表的频率。',
	'autovacuum_vacuum_cost_delay': '自动清理的延迟时间（毫秒）。当达到成本限制时，自动清理进程会延迟此时间。',
	'autovacuum_vacuum_cost_limit': '自动清理的成本限制。控制自动清理对系统的影响。',
	'autovacuum_vacuum_scale_factor': '触发自动清理的表大小比例因子。当表大小变化超过此比例时触发自动清理。',
	'autovacuum_vacuum_threshold': '触发自动清理的最小变更行数。当表变更行数超过此阈值时触发自动清理。',
	'log_autovacuum_min_duration': '记录自动清理操作的最小执行时间（毫秒）。超过此时间的自动清理操作会被记录到日志。',
	'autovacuum_freeze_max_age': '事务ID冻结的最大年龄。当表的事务ID年龄超过此值时，会触发自动清理进行冻结。',
	'autovacuum_multixact_freeze_max_age': '多事务ID冻结的最大年龄。当表的多事务ID年龄超过此值时，会触发自动清理进行冻结。',
	'autovacuum_max_workers': '同时运行的自动清理工作进程的最大数量。只能通过服务器启动时设置，需要重启服务',
	'autovacuum_work_mem': '每个自动清理工作进程使用的内存大小。用于存储死元组ID，最大有效值为1GB。',
	'vacuum_cleanup_index_scale_factor': '清理索引时的比例因子。用于确定何时触发索引清理。',
	'vacuum_cost_limit': '手动清理的成本限制。控制手动VACUUM对系统的影响。',
	'vacuum_cost_delay': '手动清理的延迟时间（毫秒）。当达到成本限制时，手动VACUUM会延迟此时间。',
	'vacuum_cost_page_dirty': '清理脏页的成本。VACUUM清理脏页时的成本权重。',
	'vacuum_cost_page_hit': '清理缓存页的成本。VACUUM清理缓存页时的成本权重。',
	'vacuum_cost_page_miss': '清理未缓存页的成本。VACUUM清理未缓存页时的成本权重。',
	'vacuum_defer_cleanup_age': '延迟清理的事务年龄。延迟清理指定年龄的事务，用于复制环境。',
	'vacuum_freeze_min_age': '事务ID冻结的最小年龄。控制何时冻结事务ID。',
	'vacuum_freeze_table_age': '表冻结的年龄阈值。当表的事务ID年龄超过此值时，会触发VACUUM进行冻结。',
	'vacuum_multixact_freeze_min_age': '多事务ID冻结的最小年龄。控制何时冻结多事务ID。',
	'vacuum_multixact_freeze_table_age': '多事务表冻结的年龄阈值。当表的多事务ID年龄超过此值时，会触发VACUUM进行冻结。',

	// WAL 相关参数
	'wal_sender_timeout': 'WAL发送超时时间。WAL发送进程等待接收确认的超时时间。',
	'wal_compression': '是否启用WAL压缩。压缩WAL数据以减少I/O和存储空间。',
	'jit': '是否启用即时编译（JIT）。JIT编译可以加速复杂查询的执行。需要重启服务才能生效',
	'wal_buffers': 'WAL缓冲区大小。用于缓存WAL数据，增加此值可以在检查点后平滑响应时间。',
	'wal_keep_size': '保留的WAL文件大小。在复制环境中保留的WAL文件数量。',
	'wal_writer_flush_after': 'WAL写入器刷新阈值。WAL写入器在写入多少数据后刷新到磁盘。',
	'min_wal_size': 'WAL文件的最小大小。WAL文件不会缩小到此值以下。',
	'max_wal_size': 'WAL文件的最大大小。当WAL大小超过此值时，会强制触发检查点。',

	// 连接和超时相关参数
	'idle_in_transaction_session_timeout': '空闲事务会话超时时间。终止长时间空闲的事务会话，防止连接泄漏。',
	'statement_timeout': '语句执行超时时间。终止执行时间超过此值的语句。',
	'tcp_keepalives_count': 'TCP keepalive 探测次数。在断开连接前发送的keepalive探测包数量。',
	'tcp_keepalives_idle': 'TCP keepalive 空闲时间（秒）。在开始发送keepalive探测包前的空闲时间。',
	'tcp_keepalives_interval': 'TCP keepalive 探测间隔（秒）。两次keepalive探测包之间的间隔时间。',

	// 核心性能参数
	'max_connections': '最大并发连接数。影响共享内存分配，需要重启服务才能生效',
	'shared_buffers': '共享缓冲区大小，用于缓存数据页。这是PostgreSQL最重要的性能参数之一，只能通过服务器启动时设置，需要重启服务',
	'effective_cache_size': '可用于磁盘缓存的估计内存大小。用于查询规划器估算可用缓存，影响查询计划选择。',
	'maintenance_work_mem': '维护操作（如VACUUM、CREATE INDEX、ALTER TABLE ADD FOREIGN KEY）使用的内存。增加此值可以加速这些操作。',
	'checkpoint_completion_target': '检查点完成目标（0.0-1.0）。控制检查点写入的平滑度，0.9表示在90%的检查点间隔内完成写入。',
	'checkpoint_timeout': '检查点超时时间。两次自动检查点之间的最大时间间隔。',
	'default_statistics_target': '默认统计信息收集目标。控制ANALYZE收集的统计信息量，影响查询优化器的选择。',
	'random_page_cost': '随机页面读取的成本估计。用于查询规划器估算随机I/O的成本，SSD通常设置为1.1，HDD为4.0。',
	'effective_io_concurrency': '有效的并发I/O操作数。用于查询规划器估算并发I/O能力，SSD通常设置为200，HDD为2-4。',
	'work_mem': '每个查询操作（排序、哈希、合并连接等）使用的内存大小。每个操作可以使用此值，多个操作会累加。',
	'huge_pages': '是否使用大页内存。只能通过服务器启动时设置，需要重启服务',

	// 并行处理相关参数
	'max_worker_processes': '最大工作进程数。限制后台工作进程的总数，包括自动清理、WAL发送等。只能通过服务器启动时设置，需要重启服务',
	'max_parallel_workers_per_gather': '每个Gather节点允许的最大并行工作进程数。控制单个查询的并行度。只能通过服务器启动时设置，需要重启服务',
	'max_parallel_workers': '最大并行工作进程数。限制所有并行查询的总工作进程数。只能通过服务器启动时设置，需要重启服务',
	'max_parallel_maintenance_workers': '最大并行维护工作进程数。用于CREATE INDEX、VACUUM等维护操作的并行执行。只能通过服务器启动时设置，需要重启服务',

	// Background writer 相关参数
	'bgwriter_lru_maxpages': '后台写入器每次写入的最大页面数。控制后台写入器每次写入的页面数量。',
	'bgwriter_lru_multiplier': '后台写入器的LRU乘数。用于计算需要写入的页面数。',

	// 其他优化参数
	'enable_partitionwise_aggregate': '是否启用分区聚合。允许在分区表上执行分区级别的聚合。',
	'enable_partitionwise_join': '是否启用分区连接。允许在分区表之间执行分区级别的连接。',
	'extra_float_digits': '浮点数显示的额外精度位数。控制浮点数在输出时的精度。',
	'max_wal_senders': '最大WAL发送进程数。限制可以同时运行的WAL发送进程数。只能通过服务器启动时设置，需要重启服务',
	'superuser_reserved_connections': '为超级用户保留的连接数。即使达到max_connections，超级用户也可以连接。',
	'temp_file_limit': '临时文件大小限制。限制单个会话可以使用的临时文件大小。',
	'track_functions': '跟踪函数调用的级别。控制是否跟踪函数调用统计信息。',
	'track_io_timing': '是否跟踪I/O操作时间。启用后可以查看pg_stat_statements中的I/O时间统计。',
	'TimeZone': '服务器时区。设置服务器的默认时区。',
	'max_replication_slots': '最大复制槽数。限制可以创建的复制槽数量。只能通过服务器启动时设置，需要重启服务',
	'max_stack_depth': '最大堆栈深度（KB）。限制服务器执行堆栈的最大深度。只能通过服务器启动时设置，需要重启服务',
	'lc_messages': '消息区域设置。设置服务器消息的语言环境。',

	// 日志相关参数
	'log_destination': '日志输出目标。可以设置为stderr、syslog、csvlog等',
	'logging_collector': '是否启用日志收集器。启用后会将stderr输出重定向到日志文件',
	'log_directory': '日志文件目录。指定日志文件的存储目录',
	'log_filename': '日志文件名模式。指定日志文件的命名模式，支持strftime格式',
	'log_truncate_on_rotation': '日志轮转时是否截断。当日志文件轮转时，是否截断而不是追加',
	'log_min_messages': '记录的最小消息级别。控制哪些级别的消息会被记录到日志。',
	'log_checkpoints': '是否记录检查点。记录每次检查点的详细信息。',
	'log_lock_waits': '是否记录锁等待。记录等待锁超过deadlock_timeout的会话。',
	'log_connections': '是否记录连接。记录所有客户端连接尝试。',
	'log_disconnections': '是否记录断开连接。记录所有客户端断开连接。',
	'log_line_prefix': '日志行前缀格式。设置每行日志的前缀格式，支持多种占位符。',
	'log_timezone': '日志时区。设置日志中时间戳的时区。',
	'log_min_duration_statement': '记录慢查询的最小执行时间。超过此时间的语句会被记录到日志。',
	'log_temp_files': '记录临时文件的最小大小。当临时文件超过此大小时会被记录。',
	'log_min_duration_sample': '采样记录的最小执行时间。超过此时间的语句会被采样记录。',
	'log_statement_sample_rate': '语句采样率。控制被采样记录的语句比例（0.0-1.0）。'
}

// English descriptions based on PostgreSQL official documentation
export const paramDescriptionsEn = {
	// Autovacuum related parameters
	'autovacuum': 'Enables the autovacuum daemon process, which automatically vacuums and updates table statistics.',
	'autovacuum_analyze_scale_factor': 'Number of tuple inserts, updates, or deletes prior to analyze as a fraction of reltuples.',
	'autovacuum_analyze_threshold': 'Minimum number of inserted, updated, or deleted tuples before analyze.',
	'autovacuum_naptime': 'Minimum delay between autovacuum runs on any given database. Controls how frequently autovacuum checks tables.',
	'autovacuum_vacuum_cost_delay': 'Vacuum cost delay for autovacuum, in milliseconds. When the cost limit has been reached, the autovacuum process will sleep for this amount of time.',
	'autovacuum_vacuum_cost_limit': 'Vacuum cost amount available for autovacuum operations. Controls the impact of autovacuum on the system.',
	'autovacuum_vacuum_scale_factor': 'Number of tuple updates or deletes prior to vacuum as a fraction of reltuples.',
	'autovacuum_vacuum_threshold': 'Minimum number of updated or deleted tuples before vacuum.',
	'log_autovacuum_min_duration': 'Causes each action executed by autovacuum to be logged if the action ran for at least the specified number of milliseconds.',
	'autovacuum_freeze_max_age': 'Age at which to autovacuum a table to prevent transaction ID wraparound. When a table\'s transaction ID age exceeds this value, autovacuum will trigger freezing.',
	'autovacuum_multixact_freeze_max_age': 'Multixact age at which to autovacuum a table to prevent multixact wraparound.',
	'autovacuum_max_workers': 'Maximum number of autovacuum processes (other than the autovacuum launcher) that may be running at any one time. Can only be set at server start, requires server restart.',
	'autovacuum_work_mem': 'Maximum amount of memory to be used by each autovacuum worker process. Used to store dead tuple IDs, maximum effective value is 1GB.',
	'vacuum_cleanup_index_scale_factor': 'Scale factor for index cleanup. Used to determine when to trigger index cleanup.',
	'vacuum_cost_limit': 'Vacuum cost amount available, which is divided among the concurrent vacuuming operations of an active VACUUM.',
	'vacuum_cost_delay': 'Vacuum cost delay in milliseconds. When the cost limit has been reached, the process will sleep for this amount of time.',
	'vacuum_cost_page_dirty': 'Vacuum cost for a page that dirtied by vacuuming. Cost weight for dirty pages during VACUUM.',
	'vacuum_cost_page_hit': 'Vacuum cost for a page found in the shared buffer cache. Cost weight for cached pages during VACUUM.',
	'vacuum_cost_page_miss': 'Vacuum cost for a page not found in the shared buffer cache. Cost weight for uncached pages during VACUUM.',
	'vacuum_defer_cleanup_age': 'Number of transactions by which VACUUM and HOT updates should defer cleanup of dead row versions. Used in replication environments.',
	'vacuum_freeze_min_age': 'Minimum age at which VACUUM should freeze a table row. Controls when transaction IDs are frozen.',
	'vacuum_freeze_table_age': 'Age at which VACUUM should scan the whole table to freeze tuples. When a table\'s transaction ID age exceeds this value, VACUUM will trigger freezing.',
	'vacuum_multixact_freeze_min_age': 'Minimum age at which VACUUM should freeze a table row\'s multixact ID. Controls when multixact IDs are frozen.',
	'vacuum_multixact_freeze_table_age': 'Age at which VACUUM should scan the whole table to freeze multixact IDs.',

	// WAL related parameters
	'wal_sender_timeout': 'Maximum time to wait for WAL replication. Timeout for WAL sender process waiting for receiver acknowledgment.',
	'wal_compression': 'Enables compression of full-page writes written in WAL. Compresses WAL data to reduce I/O and storage space.',
	'jit': 'Enables just-in-time compilation of queries. JIT compilation can speed up execution of complex queries. Requires server restart to take effect.',
	'wal_buffers': 'Amount of shared memory used for WAL data. Used to cache WAL data, increasing this value can smooth response times after checkpoints.',
	'wal_keep_size': 'Specifies the minimum size to retain in the pg_wal directory to allow standby servers to fetch WAL files for streaming replication.',
	'wal_writer_flush_after': 'Amount of WAL written out by WAL writer that triggers a flush. Amount of data WAL writer writes before flushing to disk.',
	'min_wal_size': 'Minimum size to shrink the WAL to. WAL files will not be shrunk below this value.',
	'max_wal_size': 'Maximum size to let the WAL grow to between automatic WAL checkpoints. When WAL size exceeds this value, a checkpoint will be forced.',

	// Connection and timeout related parameters
	'idle_in_transaction_session_timeout': 'Terminate any session that has been idle in a transaction state longer than the specified duration. Prevents connection leaks.',
	'statement_timeout': 'Terminates any statement that takes longer than the specified amount of time.',
	'tcp_keepalives_count': 'Maximum number of TCP keepalive probes to send before giving up and closing the connection.',
	'tcp_keepalives_idle': 'Number of seconds of inactivity after which TCP should send a keepalive message to the peer.',
	'tcp_keepalives_interval': 'Number of seconds between TCP keepalive probes.',

	// Core performance parameters
	'max_connections': 'Maximum number of concurrent connections. Affects shared memory allocation, requires server restart to take effect.',
	'shared_buffers': 'Amount of memory the database server uses for shared memory buffers. This is one of the most important PostgreSQL performance parameters. Can only be set at server start, requires server restart.',
	'effective_cache_size': 'An estimate of how much memory is available for disk caching by the operating system and within the database itself. Used by the query planner to estimate available cache, affects query plan selection.',
	'maintenance_work_mem': 'Specifies the maximum amount of memory to be used by maintenance operations, such as VACUUM, CREATE INDEX, and ALTER TABLE ADD FOREIGN KEY. Increasing this value can speed up these operations.',
	'checkpoint_completion_target': 'Target duration of checkpoint spread between checkpoints (0.0-1.0). Controls checkpoint write smoothness, 0.9 means complete writes within 90% of checkpoint interval.',
	'checkpoint_timeout': 'Maximum time between automatic WAL checkpoints. Maximum time interval between automatic checkpoints.',
	'default_statistics_target': 'Sets the default statistics target for table columns that have not had a statistics target set via ALTER TABLE SET STATISTICS. Controls the amount of statistics collected by ANALYZE, affects query optimizer choices.',
	'random_page_cost': 'Sets the planner\'s estimate of the cost of a non-sequentially-fetched disk page. Used by query planner to estimate random I/O cost, typically set to 1.1 for SSD, 4.0 for HDD.',
	'effective_io_concurrency': 'Sets the number of concurrent disk I/O operations that the system can execute. Used by query planner to estimate concurrent I/O capability, typically set to 200 for SSD, 2-4 for HDD.',
	'work_mem': 'Specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. Each operation can use this value, multiple operations will accumulate.',
	'huge_pages': 'Whether to use huge pages. Can only be set at server start, requires server restart.',

	// Parallel processing related parameters
	'max_worker_processes': 'Maximum number of background worker processes. Limits the total number of background worker processes, including autovacuum, WAL senders, etc. Can only be set at server start, requires server restart.',
	'max_parallel_workers_per_gather': 'Maximum number of parallel workers that can be started by a single Gather node. Controls the parallelism of a single query. Can only be set at server start, requires server restart.',
	'max_parallel_workers': 'Maximum number of parallel workers that can be active at one time. Limits the total number of parallel workers for all parallel queries. Can only be set at server start, requires server restart.',
	'max_parallel_maintenance_workers': 'Maximum number of parallel workers that can be started by a single utility command. Used for parallel execution of maintenance operations like CREATE INDEX, VACUUM. Can only be set at server start, requires server restart.',

	// Background writer related parameters
	'bgwriter_lru_maxpages': 'Maximum number of pages written by the background writer in each round. Controls the number of pages written by background writer each time.',
	'bgwriter_lru_multiplier': 'Multiplier used to estimate the number of pages that will be needed during the next round. Used to calculate the number of pages to write.',

	// Other optimization parameters
	'enable_partitionwise_aggregate': 'Enables or disables the query planner\'s ability to generate partitionwise aggregation plans. Allows partition-level aggregation on partitioned tables.',
	'enable_partitionwise_join': 'Enables or disables the query planner\'s ability to generate partitionwise join plans. Allows partition-level joins between partitioned tables.',
	'extra_float_digits': 'Sets the number of digits displayed for floating-point values. Controls the precision of floating-point numbers in output.',
	'max_wal_senders': 'Maximum number of simultaneously running WAL sender processes. Limits the number of WAL sender processes that can run simultaneously. Can only be set at server start, requires server restart.',
	'superuser_reserved_connections': 'Number of connection slots reserved for superusers. Superusers can connect even when max_connections is reached.',
	'temp_file_limit': 'Maximum amount of disk space that a session can use for temporary files. Limits the temporary file size that a single session can use.',
	'track_functions': 'Enables tracking of function call counts and time used. Controls whether function call statistics are tracked.',
	'track_io_timing': 'Enables timing of database I/O operations. When enabled, I/O time statistics can be viewed in pg_stat_statements.',
	'TimeZone': 'Sets the time zone for displaying and interpreting time stamps. Sets the server\'s default time zone.',
	'max_replication_slots': 'Maximum number of replication slots that can be created. Limits the number of replication slots that can be created. Can only be set at server start, requires server restart.',
	'max_stack_depth': 'Maximum safe depth of the server\'s execution stack (KB). Limits the maximum depth of the server execution stack. Can only be set at server start, requires server restart.',
	'lc_messages': 'Sets the locale to use for formatting error messages and other messages. Sets the server message locale.',

	// Logging related parameters
	'log_destination': 'Sets the output destination for log messages. Can be set to stderr, syslog, csvlog, etc.',
	'logging_collector': 'Enables the background worker process that captures log messages sent to stderr and redirects them into log files.',
	'log_directory': 'Directory where log files are written. Specifies the storage directory for log files.',
	'log_filename': 'Sets the file name pattern for log files. Specifies the naming pattern for log files, supports strftime format.',
	'log_truncate_on_rotation': 'When logging_collector is enabled, truncate (overwrite) existing log files of the same name, rather than appending to them.',
	'log_min_messages': 'Controls which message levels are written to the server log. Controls which level of messages are logged.',
	'log_checkpoints': 'Causes checkpoints and restartpoints to be logged in the server log. Logs detailed information for each checkpoint.',
	'log_lock_waits': 'Controls whether a log message is produced when a session waits longer than deadlock_timeout to acquire a lock. Logs sessions waiting for locks exceeding deadlock_timeout.',
	'log_connections': 'Causes each attempted connection to the server to be logged. Logs all client connection attempts.',
	'log_disconnections': 'Causes session terminations to be logged. Logs all client disconnections.',
	'log_line_prefix': 'Controls what information is written to the server log for each log message. Sets the prefix format for each log line, supports multiple placeholders.',
	'log_timezone': 'Sets the time zone to use when writing log timestamps. Sets the time zone for timestamps in logs.',
	'log_min_duration_statement': 'Causes the duration of each completed statement to be logged if the statement ran for at least the specified number of milliseconds. Statements exceeding this time will be logged.',
	'log_temp_files': 'Causes temporary file names and sizes to be logged when a temporary file is deleted. Temporary files exceeding this size will be logged.',
	'log_min_duration_sample': 'Minimum execution time above which a sample of statements will be logged. Statements exceeding this time will be sampled and logged.',
	'log_statement_sample_rate': 'Fraction of statements exceeding log_min_duration_sample to be logged. Controls the proportion of statements that are sampled and logged (0.0-1.0).'
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
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {string} 参数说明，如果不存在则返回默认说明
 */
export function getParamDescription(paramName, lang = 'zh') {
	if (lang === 'en') {
		return paramDescriptionsEn[paramName] || 'Please refer to PostgreSQL official documentation for detailed description of this parameter'
	}
	return paramDescriptions[paramName] || '该参数的详细说明请参考 PostgreSQL 官方文档'
}

