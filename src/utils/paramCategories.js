/**
 * 参数分组定义。分类名用中文作内部 key，展示层再翻译，避免英文 key 与历史数据对不上。
 */
export const PARAM_CATEGORIES = {
  PERFORMANCE: '性能相关参数',
  AUTOVACUUM: '自动清理相关配置',
  TIMEOUT: '超时相关',
  LOGGING: '日志记录相关',
  OTHER: '其他参数'
}

const PERFORMANCE_PARAMS = new Set([
  'wal_sender_timeout', 'wal_compression', 'jit', 'max_connections',
  'shared_buffers', 'effective_cache_size', 'maintenance_work_mem',
  'checkpoint_completion_target', 'wal_buffers', 'wal_keep_size',
  'wal_writer_flush_after', 'checkpoint_timeout', 'default_statistics_target',
  'random_page_cost', 'effective_io_concurrency', 'maintenance_io_concurrency',
  'work_mem', 'hash_mem_multiplier', 'huge_pages',
  'min_wal_size', 'max_wal_size', 'max_worker_processes',
  'max_parallel_workers_per_gather', 'max_parallel_workers',
  'max_parallel_maintenance_workers', 'bgwriter_lru_maxpages',
  'bgwriter_lru_multiplier', 'enable_partitionwise_aggregate',
  'enable_partitionwise_join', 'extra_float_digits', 'max_wal_senders',
  'superuser_reserved_connections', 'temp_file_limit', 'track_io_timing',
  'track_wal_io_timing', 'compute_query_id', 'max_replication_slots',
  'max_stack_depth', 'wal_level', 'io_combine_limit', 'io_max_combine_limit',
  'io_method', 'io_workers', 'max_locks_per_transaction'
])

const AUTOVACUUM_PARAMS = new Set([
  'autovacuum', 'autovacuum_analyze_scale_factor', 'autovacuum_analyze_threshold',
  'autovacuum_naptime', 'autovacuum_vacuum_cost_delay', 'autovacuum_vacuum_cost_limit',
  'autovacuum_vacuum_scale_factor', 'autovacuum_vacuum_threshold',
  'log_autovacuum_min_duration', 'autovacuum_freeze_max_age',
  'autovacuum_multixact_freeze_max_age', 'autovacuum_max_workers',
  'autovacuum_worker_slots', 'autovacuum_work_mem', 'autovacuum_vacuum_max_threshold',
  'vacuum_cleanup_index_scale_factor', 'vacuum_cost_limit',
  'vacuum_cost_delay', 'vacuum_cost_page_dirty', 'vacuum_cost_page_hit',
  'vacuum_cost_page_miss', 'vacuum_defer_cleanup_age', 'vacuum_freeze_min_age',
  'vacuum_freeze_table_age', 'vacuum_multixact_freeze_min_age',
  'vacuum_multixact_freeze_table_age', 'vacuum_failsafe_age',
  'vacuum_multixact_failsafe_age', 'vacuum_buffer_usage_limit',
  'vacuum_max_eager_freeze_failure_rate'
])

const TIMEOUT_PARAMS = new Set([
  'idle_in_transaction_session_timeout', 'idle_session_timeout', 'statement_timeout',
  'client_connection_check_interval', 'tcp_keepalives_count', 'tcp_keepalives_idle',
  'tcp_keepalives_interval'
])

const LOGGING_PARAMS = new Set([
  'log_destination', 'logging_collector', 'log_directory', 'log_filename',
  'log_truncate_on_rotation', 'log_min_messages', 'log_checkpoints',
  'log_lock_waits', 'log_connections', 'log_disconnections', 'log_line_prefix',
  'log_timezone', 'log_min_duration_statement', 'log_temp_files',
  'log_min_duration_sample', 'log_statement_sample_rate', 'lc_messages'
])

/**
 * 获取参数的分组。未知参数进「其他」，避免漏分类把表格打散。
 */
export function getParamCategory(paramName) {
  if (PERFORMANCE_PARAMS.has(paramName)) {
    return PARAM_CATEGORIES.PERFORMANCE
  }
  if (AUTOVACUUM_PARAMS.has(paramName)) {
    return PARAM_CATEGORIES.AUTOVACUUM
  }
  if (TIMEOUT_PARAMS.has(paramName)) {
    return PARAM_CATEGORIES.TIMEOUT
  }
  if (LOGGING_PARAMS.has(paramName)) {
    return PARAM_CATEGORIES.LOGGING
  }
  return PARAM_CATEGORIES.OTHER
}

/**
 * 把参数的存在区间收成短标签。until 为空表示官方至今仍保留该参数，
 * 因此 13 引入且未移除的参数不显示标签，避免整张表都是噪音徽章。
 */
export function getParamVersionLabel(since, until) {
  const from = since || 13
  if (!until) {
    return from <= 13 ? '' : `PG${from}+`
  }
  if (from <= 13) {
    return `≤PG${until}`
  }
  if (from === until) {
    return `PG${from}`
  }
  return `PG${from}–${until}`
}
