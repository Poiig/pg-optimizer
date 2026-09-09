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
	'autovacuum_vacuum_cost_limit': '自动清理的总成本配额，由正在运行的 worker 平分。按 max_workers×200 给出，满员时每人相当于官方默认，避免加人后反而扫得更慢。',
	'autovacuum_vacuum_scale_factor': '触发自动清理的表大小比例因子。当表大小变化超过此比例时触发自动清理。',
	'autovacuum_vacuum_threshold': '触发自动清理的最小变更行数。当表变更行数超过此阈值时触发自动清理。',
	'log_autovacuum_min_duration': '自动清理耗时达到该阈值才写日志。设 5 秒：能看到偏慢的 vacuum/analyze，又不会把短扫刷满日志。',
	'autovacuum_freeze_max_age': '事务ID冻结的最大年龄。当表的事务ID年龄超过此值时，会触发自动清理进行冻结。',
	'autovacuum_multixact_freeze_max_age': '多事务ID冻结的最大年龄。当表的多事务ID年龄超过此值时，会触发自动清理进行冻结。',
	'autovacuum_max_workers': '同时运行的自动清理工作进程的最大数量。PG18 起配合 autovacuum_worker_slots，reload 即可调整；更早版本只能重启改。',
	'autovacuum_work_mem': '每个自动清理工作进程使用的内存。按内存公式计算，上限 1GB。',
	'vacuum_cleanup_index_scale_factor': '清理索引时的比例因子。用于确定何时触发索引清理。',
	'vacuum_cost_limit': '手动清理的成本限制。控制手动VACUUM对系统的影响。',
	'vacuum_cost_delay': '手动清理的延迟时间（毫秒）。当达到成本限制时，手动VACUUM会延迟此时间。',
	'vacuum_cost_page_dirty': '清理脏页的成本。VACUUM清理脏页时的成本权重。',
	'vacuum_cost_page_hit': '清理缓存页的成本。VACUUM清理缓存页时的成本权重。',
	'vacuum_cost_page_miss': '清理未缓存页的成本。VACUUM清理未缓存页时的成本权重。',
	'vacuum_defer_cleanup_age': '延迟清理的事务年龄。延迟清理指定年龄的事务，用于复制环境。',
	'vacuum_freeze_min_age': '事务ID冻结的最小年龄。控制何时冻结事务ID。',
	'vacuum_freeze_table_age': '触发全表冻结扫描的年龄阈值，官方默认 1.5 亿。VACUUM 会静默把生效值压到 autovacuum_freeze_max_age 的 95%，设得比它高不会有额外效果。',
	'vacuum_multixact_freeze_min_age': '多事务ID冻结的最小年龄。控制何时冻结多事务ID。',
	'vacuum_multixact_freeze_table_age': '触发全表 multixact 冻结扫描的年龄阈值，官方默认 1.5 亿，同样会被钳到 multixact_freeze_max_age 的 95%。',

	// WAL 相关参数
	'wal_sender_timeout': 'WAL发送超时时间。WAL发送进程等待接收确认的超时时间。',
	'wal_compression': 'WAL 全页写入压缩。PG15 起用算法名，lz4 是常见发行版的默认编进选项，CPU 开销低于 pglz。',
	'jit': '是否启用即时编译。短查询的 OLTP 通常关，避免规划阶段的编译开销。会话级可 SET，不必重启。',
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
	'max_connections': '最大并发连接数，需重启，且共享内存等资源按它分配。本工具按 CPU 核数 × 200 给出上限，<b>可酌情减少</b>：官方默认只有 100，社区经验公式约束的是「活跃」连接数——CPU 核数 × 2 + 有效磁盘轴数（数据基本命中缓存时轴数按 0 算），多出来的并发交给 PgBouncer 等连接池排队反而更快。实际做法是先定连接池上限，再把本参数设成比它略大，留几个位给运维和监控。',
	'shared_buffers': '共享缓冲区大小，用于缓存数据页。这是PostgreSQL最重要的性能参数之一，只能通过服务器启动时设置，需要重启服务',
	'effective_cache_size': '可用于磁盘缓存的估计内存大小。用于查询规划器估算可用缓存，影响查询计划选择。',
	'maintenance_work_mem': '维护操作（如VACUUM、CREATE INDEX、ALTER TABLE ADD FOREIGN KEY）使用的内存。增加此值可以加速这些操作。',
	'checkpoint_completion_target': '检查点完成目标（0.0-1.0）。控制检查点写入的平滑度，0.9表示在90%的检查点间隔内完成写入。',
	'checkpoint_timeout': '检查点超时时间。两次自动检查点之间的最大时间间隔。',
	'default_statistics_target': '默认统计信息收集目标。控制ANALYZE收集的统计信息量，影响查询优化器的选择。',
	'random_page_cost': '随机页面读取的成本估计。用于查询规划器估算随机I/O的成本，SSD通常设置为1.1，HDD为4.0。',
	'effective_io_concurrency': '查询路径的预读并发。HDD 单盘 2；HDD RAID 按数据盘块数（不含校验盘）；SATA/SAS SSD 128；本地 NVMe 200。',
	'maintenance_io_concurrency': '维护路径（VACUUM、建索引）的预读并发。HDD 单盘 2；HDD RAID 按数据盘块数；SATA/SAS SSD 与 NVMe 均为 64。',
	'hash_mem_multiplier': '哈希表可用内存 = work_mem × 本参数。推荐 2.0，减少哈希节点落盘。',
	'work_mem': '每个查询操作（排序、哈希、合并连接等）使用的内存大小。每个操作可以使用此值，多个操作会累加。',
	'huge_pages': '是否使用大页内存。只能通过服务器启动时设置，需要重启服务',

	// 并行处理相关参数
	'max_worker_processes': '后台工作进程池大小，并行查询、并行维护都从这里取。只能重启修改。',
	'max_parallel_workers_per_gather': '单个 Gather 节点能拉起的并行 worker 数。会话级可 SET，不必重启。每个 worker 独占一份 work_mem。',
	'max_parallel_workers': '全库同时处于并行查询的 worker 上限，不能超过 max_worker_processes。会话级可 SET。',
	'max_parallel_maintenance_workers': 'CREATE INDEX、VACUUM 等维护命令的并行 worker 上限。会话级可 SET。',

	// Background writer 相关参数
	'bgwriter_lru_maxpages': '后台写入器每次写入的最大页面数。控制后台写入器每次写入的页面数量。',
	'bgwriter_lru_multiplier': '后台写入器的LRU乘数。用于计算需要写入的页面数。',

	// 其他优化参数
	'enable_partitionwise_aggregate': '是否启用分区聚合。允许在分区表上执行分区级别的聚合。',
	'enable_partitionwise_join': '是否启用分区连接。允许在分区表之间执行分区级别的连接。',
	'extra_float_digits': '浮点数显示的额外精度位数。控制浮点数在输出时的精度。',
	'max_wal_senders': '最大WAL发送进程数。限制可以同时运行的WAL发送进程数。只能通过服务器启动时设置，需要重启服务',
	'max_locks_per_transaction': '单事务可持有的锁槽数（平均值），需重启。锁表按 本值 ×（max_connections + max_prepared_transactions）预分配，单个事务超出也没关系，只要全库总量不超。多租户和分区表场景一个事务会摸到几十张表加各自的索引，官方默认 64 容易报 out of shared memory。',
	'superuser_reserved_connections': '为超级用户保留的连接数。即使达到max_connections，超级用户也可以连接。',
	'temp_file_limit': '临时文件大小限制。限制单个会话可以使用的临时文件大小。',
	'track_functions': '跟踪函数调用的级别。控制是否跟踪函数调用统计信息。',
	'track_io_timing': '是否跟踪I/O操作时间。启用后可以查看pg_stat_statements中的I/O时间统计。',
	'TimeZone': '服务器时区。设置服务器的默认时区。',
	'max_replication_slots': '最大复制槽数。限制可以创建的复制槽数量。只能通过服务器启动时设置，需要重启服务',
	'max_stack_depth': '服务器执行栈的安全深度上限。超级用户可在会话里调整，不必重启。',
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
	'log_connections': '是否记录连接尝试。短连接多的系统开着会刷日志，默认关。PG18 起该参数改成字符串列表（receipt/authentication/authorization/setup_durations），可只记需要的阶段，同时仍兼容 on/off。',
	'log_disconnections': '是否记录断开连接。记录所有客户端断开连接。',
	'log_line_prefix': '日志行前缀格式。设置每行日志的前缀格式，支持多种占位符。',
	'log_timezone': '日志时区。设置日志中时间戳的时区。',
	'log_min_duration_statement': '记录慢查询的最小执行时间。超过此时间的语句会被记录到日志。',
	'log_temp_files': '临时文件删除时，大小达到该阈值才记日志。0 记全部，-1 关闭。阈值偏大只抓严重溢写，偏小能更早发现 work_mem 不够。',
	'log_min_duration_sample': '采样慢语句的最低耗时（PG13 起）。达到该时间的语句按 log_statement_sample_rate 抽样记录；已超过 log_min_duration_statement 的仍全量记录。',
	'log_statement_sample_rate': '对达到 log_min_duration_sample 的语句的记录比例（0–1，PG13 起）。',

	'track_wal_io_timing': '是否统计 WAL I/O 耗时。PG14 引入，便于和 track_io_timing 一起看检查点写入。',
	'compute_query_id': '是否计算 query id。auto 会在加载 pg_stat_statements 时自动打开，避免扩展无 id 可用。',
	'idle_session_timeout': '空闲但不在事务中的会话超时。PG14 引入，用来回收连接池之外泄漏的空闲连接。<b>注意</b>：它同样会断开连接池里的空闲连接，配置前先确认 PgBouncer 的 server_idle_timeout 或 HikariCP 的 idleTimeout 比它更短，否则应用侧会看到偶发的连接被重置。',
	'client_connection_check_interval': '查询执行期间检查客户端是否已断开的间隔。避免已断开客户端继续跑重查询。',
	'vacuum_failsafe_age': '为避免事务 ID 回卷，VACUUM 进入 failsafe 模式的年龄阈值。',
	'vacuum_multixact_failsafe_age': '多事务 ID 回卷保护的 failsafe 年龄阈值。',
	'vacuum_buffer_usage_limit': 'VACUUM/ANALYZE 使用的环形缓冲区大小。限制真空过程挤占 shared_buffers。',
	'vacuum_max_eager_freeze_failure_rate': 'eager freeze 扫描失败页占比上限，超过后停止激进冻结，避免空转。',
	'autovacuum_worker_slots': '为 autovacuum worker 预留的后端槽位数，官方默认 16，只能重启修改。它是 max_workers 的上限池，所以槽位要留够（≥ 以后可能用到的 max_workers），之后调整 autovacuum_max_workers 才能 reload 生效。',
	'autovacuum_vacuum_max_threshold': '触发 autovacuum 的死元组数量上限。大表上防止只靠比例因子导致真空过晚。',
	'io_combine_limit': '相邻 I/O 请求合并后的最大大小。更大的值有利于顺序扫描，但受 io_max_combine_limit 限制。',
	'io_max_combine_limit': '服务器级 I/O 合并上限，用来钳制 io_combine_limit。仅 PG18。',
	'io_method': 'PG18 异步 I/O 机制：worker / io_uring / sync。Linux 发行版编了 liburing 时优先 io_uring。',
	'io_workers': 'io_method=worker 时的 IO worker 数量。io_uring 模式下此参数无意义。',
	'wal_level': 'WAL 记录级别。minimal 会关闭复制所需信息，只适合单机桌面场景。'
}

// English descriptions based on PostgreSQL official documentation
export const paramDescriptionsEn = {
	// Autovacuum related parameters
	'autovacuum': 'Enables the autovacuum daemon process, which automatically vacuums and updates table statistics.',
	'autovacuum_analyze_scale_factor': 'Number of tuple inserts, updates, or deletes prior to analyze as a fraction of reltuples.',
	'autovacuum_analyze_threshold': 'Minimum number of inserted, updated, or deleted tuples before analyze.',
	'autovacuum_naptime': 'Minimum delay between autovacuum runs on any given database. Controls how frequently autovacuum checks tables.',
	'autovacuum_vacuum_cost_delay': 'Vacuum cost delay for autovacuum, in milliseconds. When the cost limit has been reached, the autovacuum process will sleep for this amount of time.',
	'autovacuum_vacuum_cost_limit': 'Total vacuum cost budget shared among running autovacuum workers. Set to max_workers×200 so each worker keeps the default 200 when the pool is full.',
	'autovacuum_vacuum_scale_factor': 'Number of tuple updates or deletes prior to vacuum as a fraction of reltuples.',
	'autovacuum_vacuum_threshold': 'Minimum number of updated or deleted tuples before vacuum.',
	'log_autovacuum_min_duration': 'Log an autovacuum action when it runs at least this long. 5s catches slow vacuums without flooding the log with short runs.',
	'autovacuum_freeze_max_age': 'Age at which to autovacuum a table to prevent transaction ID wraparound. When a table\'s transaction ID age exceeds this value, autovacuum will trigger freezing.',
	'autovacuum_multixact_freeze_max_age': 'Multixact age at which to autovacuum a table to prevent multixact wraparound.',
	'autovacuum_max_workers': 'Maximum number of autovacuum worker processes. From PostgreSQL 18 this can be changed with a reload once autovacuum_worker_slots is large enough; earlier versions need a restart.',
	'autovacuum_work_mem': 'Memory used by each autovacuum worker. Same formula as before, capped at 1GB.',
	'vacuum_cleanup_index_scale_factor': 'Scale factor for index cleanup. Used to determine when to trigger index cleanup.',
	'vacuum_cost_limit': 'Vacuum cost amount available, which is divided among the concurrent vacuuming operations of an active VACUUM.',
	'vacuum_cost_delay': 'Vacuum cost delay in milliseconds. When the cost limit has been reached, the process will sleep for this amount of time.',
	'vacuum_cost_page_dirty': 'Vacuum cost for a page that dirtied by vacuuming. Cost weight for dirty pages during VACUUM.',
	'vacuum_cost_page_hit': 'Vacuum cost for a page found in the shared buffer cache. Cost weight for cached pages during VACUUM.',
	'vacuum_cost_page_miss': 'Vacuum cost for a page not found in the shared buffer cache. Cost weight for uncached pages during VACUUM.',
	'vacuum_defer_cleanup_age': 'Number of transactions by which VACUUM and HOT updates should defer cleanup of dead row versions. Used in replication environments.',
	'vacuum_freeze_min_age': 'Minimum age at which VACUUM should freeze a table row. Controls when transaction IDs are frozen.',
	'vacuum_freeze_table_age': 'Age at which VACUUM performs an aggressive whole-table scan to freeze tuples; the default is 150 million. VACUUM silently clamps the effective value to 95% of autovacuum_freeze_max_age, so setting it higher has no extra effect.',
	'vacuum_multixact_freeze_min_age': 'Minimum age at which VACUUM should freeze a table row\'s multixact ID. Controls when multixact IDs are frozen.',
	'vacuum_multixact_freeze_table_age': 'Age at which VACUUM aggressively freezes multixact IDs; the default is 150 million, clamped to 95% of autovacuum_multixact_freeze_max_age.',

	// WAL related parameters
	'wal_sender_timeout': 'Maximum time to wait for WAL replication. Timeout for WAL sender process waiting for receiver acknowledgment.',
	'wal_compression': 'Compresses full-page writes in WAL. From PostgreSQL 15 this takes an algorithm name; lz4 is built in on typical packages and costs less CPU than pglz.',
	'jit': 'Enables just-in-time compilation. Usually off for short OLTP queries so planning does not pay compile cost. Can be SET per session.',
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
	'max_connections': 'Maximum number of concurrent connections. Requires a restart, and several shared memory structures are sized from it. This tool derives it from cores x 200, and you <b>can safely lower it</b>: the official default is only 100, and the community rule of thumb bounds the number of *active* connections at (cores x 2) + effective spindle count (spindles count as 0 once the working set is cached). Queueing the excess in a pooler such as PgBouncer is usually faster. In practice, pick the pool ceiling first, then set this slightly above it, leaving a few slots for maintenance and monitoring.',
	'shared_buffers': 'Amount of memory the database server uses for shared memory buffers. This is one of the most important PostgreSQL performance parameters. Can only be set at server start, requires server restart.',
	'effective_cache_size': 'An estimate of how much memory is available for disk caching by the operating system and within the database itself. Used by the query planner to estimate available cache, affects query plan selection.',
	'maintenance_work_mem': 'Specifies the maximum amount of memory to be used by maintenance operations, such as VACUUM, CREATE INDEX, and ALTER TABLE ADD FOREIGN KEY. Increasing this value can speed up these operations.',
	'checkpoint_completion_target': 'Target duration of checkpoint spread between checkpoints (0.0-1.0). Controls checkpoint write smoothness, 0.9 means complete writes within 90% of checkpoint interval.',
	'checkpoint_timeout': 'Maximum time between automatic WAL checkpoints. Maximum time interval between automatic checkpoints.',
	'default_statistics_target': 'Sets the default statistics target for table columns that have not had a statistics target set via ALTER TABLE SET STATISTICS. Controls the amount of statistics collected by ANALYZE, affects query optimizer choices.',
	'random_page_cost': 'Sets the planner\'s estimate of the cost of a non-sequentially-fetched disk page. Used by query planner to estimate random I/O cost, typically set to 1.1 for SSD, 4.0 for HDD.',
	'effective_io_concurrency': 'Query-path prefetch concurrency. 2 on a single HDD; RAID uses the data-disk count (parity excluded); 128 on SATA/SAS SSD; 200 on local NVMe.',
	'work_mem': 'Specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. Each operation can use this value, multiple operations will accumulate.',
	'huge_pages': 'Whether to use huge pages. Can only be set at server start, requires server restart.',

	// Parallel processing related parameters
	'max_worker_processes': 'Size of the background worker pool that parallel queries and maintenance draw from. Restart required.',
	'max_parallel_workers_per_gather': 'Parallel workers a single Gather node may start. Can be SET per session. Each worker takes its own work_mem.',
	'max_parallel_workers': 'Server-wide cap on parallel query workers; cannot exceed max_worker_processes. Can be SET per session.',
	'max_parallel_maintenance_workers': 'Parallel workers allowed for CREATE INDEX and VACUUM. Can be SET per session.',

	// Background writer related parameters
	'bgwriter_lru_maxpages': 'Maximum number of pages written by the background writer in each round. Controls the number of pages written by background writer each time.',
	'bgwriter_lru_multiplier': 'Multiplier used to estimate the number of pages that will be needed during the next round. Used to calculate the number of pages to write.',

	// Other optimization parameters
	'enable_partitionwise_aggregate': 'Enables or disables the query planner\'s ability to generate partitionwise aggregation plans. Allows partition-level aggregation on partitioned tables.',
	'enable_partitionwise_join': 'Enables or disables the query planner\'s ability to generate partitionwise join plans. Allows partition-level joins between partitioned tables.',
	'extra_float_digits': 'Sets the number of digits displayed for floating-point values. Controls the precision of floating-point numbers in output.',
	'max_wal_senders': 'Maximum number of simultaneously running WAL sender processes. Limits the number of WAL sender processes that can run simultaneously. Can only be set at server start, requires server restart.',
	'max_locks_per_transaction': 'Average number of lock slots per transaction; requires a restart. The lock table is sized as this value x (max_connections + max_prepared_transactions), so a single transaction may exceed it as long as the server-wide total does not. Multi-tenant and partitioned schemas touch dozens of tables plus their indexes in one transaction, where the default of 64 tends to raise "out of shared memory".',
	'superuser_reserved_connections': 'Number of connection slots reserved for superusers. Superusers can connect even when max_connections is reached.',
	'temp_file_limit': 'Maximum amount of disk space that a session can use for temporary files. Limits the temporary file size that a single session can use.',
	'track_functions': 'Enables tracking of function call counts and time used. Controls whether function call statistics are tracked.',
	'track_io_timing': 'Enables timing of database I/O operations. When enabled, I/O time statistics can be viewed in pg_stat_statements.',
	'TimeZone': 'Sets the time zone for displaying and interpreting time stamps. Sets the server\'s default time zone.',
	'max_replication_slots': 'Maximum number of replication slots that can be created. Limits the number of replication slots that can be created. Can only be set at server start, requires server restart.',
	'max_stack_depth': 'Safe depth of the server execution stack. Superusers can change it in a session; no restart.',
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
	'log_connections': 'Logs connection attempts. Left off because short-lived connections would flood the log. From PostgreSQL 18 it takes a comma-separated list (receipt, authentication, authorization, setup_durations) so single phases can be logged, while on/off is still accepted.',
	'log_disconnections': 'Causes session terminations to be logged. Logs all client disconnections.',
	'log_line_prefix': 'Controls what information is written to the server log for each log message. Sets the prefix format for each log line, supports multiple placeholders.',
	'log_timezone': 'Sets the time zone to use when writing log timestamps. Sets the time zone for timestamps in logs.',
	'log_min_duration_statement': 'Causes the duration of each completed statement to be logged if the statement ran for at least the specified number of milliseconds. Statements exceeding this time will be logged.',
	'log_temp_files': 'Log temporary files when they are deleted if they are at least this large. 0 logs all, -1 disables. A high threshold only catches severe spills; a lower one surfaces work_mem pressure earlier.',
	'log_min_duration_sample': 'Minimum duration for sampled statement logging (since PG13). Statements this long may be logged per log_statement_sample_rate; those over log_min_duration_statement are always logged.',
	'log_statement_sample_rate': 'Fraction (0–1) of statements exceeding log_min_duration_sample to log (since PG13).',

	'hash_mem_multiplier': 'Hash table memory is work_mem times this value. Recommended 2.0 so hash nodes spill less.',
	'maintenance_io_concurrency': 'Prefetch concurrency for VACUUM and index builds. 2 on a single HDD; RAID uses the data-disk count; 64 on SATA/SAS SSD and local NVMe.',
	'track_wal_io_timing': 'Enables timing of WAL I/O. Added in PostgreSQL 14; useful together with track_io_timing for checkpoint analysis.',
	'compute_query_id': 'Controls query identifier computation. auto turns it on when pg_stat_statements is loaded.',
	'idle_session_timeout': 'Terminates sessions that have been idle outside a transaction. Added in PostgreSQL 14 to reclaim leaked idle connections. <b>Note</b>: it also closes idle connections held by a pooler, so make sure PgBouncer server_idle_timeout or HikariCP idleTimeout is shorter, otherwise the application will see sporadic reset connections.',
	'client_connection_check_interval': 'How often to check whether the client has disconnected while a query is running.',
	'vacuum_failsafe_age': 'Age at which VACUUM triggers failsafe behavior to avoid transaction ID wraparound.',
	'vacuum_multixact_failsafe_age': 'Multixact age at which VACUUM triggers failsafe behavior.',
	'vacuum_buffer_usage_limit': 'Size of the buffer access strategy ring used by VACUUM and ANALYZE, so vacuum does not evict too much of shared_buffers.',
	'vacuum_max_eager_freeze_failure_rate': 'Maximum fraction of pages that may fail eager freezing before VACUUM disables eager scanning.',
	'autovacuum_worker_slots': 'Backend slots reserved for autovacuum workers; the default is 16 and it can only be changed with a restart. It acts as the ceiling for max_workers, so keep enough slots for any value of autovacuum_max_workers you may later want to apply with a reload.',
	'autovacuum_vacuum_max_threshold': 'Maximum number of updated or deleted tuples that can trigger autovacuum, capping scale-factor delays on very large tables.',
	'io_combine_limit': 'Largest I/O size used when combining adjacent requests. Larger values help sequential scans; clamped by io_max_combine_limit.',
	'io_max_combine_limit': 'Server-wide cap on io_combine_limit. PostgreSQL 18 only.',
	'io_method': 'PostgreSQL 18 asynchronous I/O method: worker, io_uring, or sync. Prefer io_uring when the server was built with liburing.',
	'io_workers': 'Number of I/O worker processes when io_method=worker. Ignored for io_uring.',
	'wal_level': 'WAL logging level. minimal drops information required for replication and should only be used on standalone desktop instances.'
}

/**
 * 参数到官方文档章节的显式映射。按前缀猜会把 vacuum_freeze_* 指到 autovacuum、
 * hash_mem_multiplier 指到 query，点开就是死锚点。
 * PG18 把 autovacuum 页并进新建的 runtime-config-vacuum.html。
 */
const vacuumPage = (version) => (version >= 18 ? 'vacuum' : 'autovacuum')

const DOC_PAGE = {
	autovacuum: vacuumPage,
	autovacuum_analyze_scale_factor: vacuumPage,
	autovacuum_analyze_threshold: vacuumPage,
	autovacuum_naptime: vacuumPage,
	autovacuum_vacuum_cost_delay: vacuumPage,
	autovacuum_vacuum_cost_limit: vacuumPage,
	autovacuum_vacuum_scale_factor: vacuumPage,
	autovacuum_vacuum_threshold: vacuumPage,
	autovacuum_freeze_max_age: vacuumPage,
	autovacuum_multixact_freeze_max_age: vacuumPage,
	autovacuum_max_workers: vacuumPage,
	autovacuum_worker_slots: vacuumPage,
	autovacuum_vacuum_max_threshold: vacuumPage,
	autovacuum_work_mem: 'resource',
	log_autovacuum_min_duration: (version) => (version >= 14 ? 'logging' : 'autovacuum'),
	vacuum_cost_limit: (version) => (version >= 18 ? 'vacuum' : 'resource'),
	vacuum_cost_delay: (version) => (version >= 18 ? 'vacuum' : 'resource'),
	vacuum_cost_page_dirty: (version) => (version >= 18 ? 'vacuum' : 'resource'),
	vacuum_cost_page_hit: (version) => (version >= 18 ? 'vacuum' : 'resource'),
	vacuum_cost_page_miss: (version) => (version >= 18 ? 'vacuum' : 'resource'),
	vacuum_freeze_min_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_freeze_table_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_multixact_freeze_min_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_multixact_freeze_table_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_failsafe_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_multixact_failsafe_age: (version) => (version >= 18 ? 'vacuum' : 'client'),
	vacuum_max_eager_freeze_failure_rate: 'vacuum',
	vacuum_defer_cleanup_age: 'replication',
	vacuum_buffer_usage_limit: 'resource',
	vacuum_cleanup_index_scale_factor: 'client',
	wal_sender_timeout: 'replication',
	wal_compression: 'wal',
	wal_buffers: 'wal',
	wal_keep_size: 'wal',
	wal_writer_flush_after: 'wal',
	wal_level: 'wal',
	min_wal_size: 'wal',
	max_wal_size: 'wal',
	checkpoint_completion_target: 'wal',
	checkpoint_timeout: 'wal',
	max_wal_senders: 'replication',
	max_replication_slots: 'replication',
	max_connections: 'connection',
	reserved_connections: 'connection',
	superuser_reserved_connections: 'connection',
	tcp_keepalives_count: 'connection',
	tcp_keepalives_idle: 'connection',
	tcp_keepalives_interval: 'connection',
	client_connection_check_interval: 'connection',
	idle_in_transaction_session_timeout: 'client',
	idle_session_timeout: 'client',
	statement_timeout: 'client',
	extra_float_digits: 'client',
	TimeZone: 'client',
	lc_messages: 'client',
	effective_cache_size: 'query',
	jit: 'query',
	random_page_cost: 'query',
	default_statistics_target: 'query',
	enable_partitionwise_aggregate: 'query',
	enable_partitionwise_join: 'query',
	hash_mem_multiplier: 'resource',
	compute_query_id: 'statistics',
	track_io_timing: 'statistics',
	track_wal_io_timing: 'statistics',
	track_functions: 'statistics',
	max_locks_per_transaction: 'locks'
}

/**
 * 拼官方文档锚点。PG13 文档已撤 vacuum_cleanup_index_scale_factor，锚点改指还收录它的 12。
 */
export function getParamDocUrl(paramName, dbVersion = '13') {
	const version = Number(dbVersion) || 13
	if (paramName === 'vacuum_cleanup_index_scale_factor') {
		return 'https://www.postgresql.org/docs/12/runtime-config-client.html#GUC-VACUUM-CLEANUP-INDEX-SCALE-FACTOR'
	}
	const mapped = DOC_PAGE[paramName]
	const page = typeof mapped === 'function' ? mapped(version) : (mapped || 'resource')
	const anchor = paramName.replace(/_/g, '-')
	return `https://www.postgresql.org/docs/${version}/runtime-config-${page}.html#GUC-${anchor.toUpperCase()}`
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

