/**
 * 参数分组定义
 */
export const PARAM_CATEGORIES = {
  PERFORMANCE: '性能相关参数',
  AUTOVACUUM: '自动清理相关配置',
  TIMEOUT: '超时相关',
  LOGGING: '日志记录相关',
  OTHER: '其他参数'
}

/**
 * 获取参数的分组
 */
export function getParamCategory(paramName) {
  // 性能相关参数
  if (['wal_sender_timeout', 'wal_compression', 'jit', 'max_connections', 
       'shared_buffers', 'effective_cache_size', 'maintenance_work_mem',
       'checkpoint_completion_target', 'wal_buffers', 'wal_keep_size',
       'wal_writer_flush_after', 'checkpoint_timeout', 'default_statistics_target',
       'random_page_cost', 'effective_io_concurrency', 'work_mem', 'huge_pages',
       'min_wal_size', 'max_wal_size', 'max_worker_processes',
       'max_parallel_workers_per_gather', 'max_parallel_workers',
       'max_parallel_maintenance_workers', 'bgwriter_lru_maxpages',
       'bgwriter_lru_multiplier', 'enable_partitionwise_aggregate',
       'enable_partitionwise_join', 'extra_float_digits', 'max_wal_senders',
       'superuser_reserved_connections', 'temp_file_limit', 'track_io_timing',
       'max_replication_slots', 'max_stack_depth'].includes(paramName)) {
    return PARAM_CATEGORIES.PERFORMANCE
  }
  
  // 自动清理相关配置
  if (['autovacuum', 'autovacuum_analyze_scale_factor', 'autovacuum_analyze_threshold',
       'autovacuum_naptime', 'autovacuum_vacuum_cost_delay', 'autovacuum_vacuum_cost_limit',
       'autovacuum_vacuum_scale_factor', 'autovacuum_vacuum_threshold',
       'log_autovacuum_min_duration', 'autovacuum_freeze_max_age',
       'autovacuum_multixact_freeze_max_age', 'autovacuum_max_workers',
       'autovacuum_work_mem', 'vacuum_cleanup_index_scale_factor', 'vacuum_cost_limit',
       'vacuum_cost_delay', 'vacuum_cost_page_dirty', 'vacuum_cost_page_hit',
       'vacuum_cost_page_miss', 'vacuum_defer_cleanup_age', 'vacuum_freeze_min_age',
       'vacuum_freeze_table_age', 'vacuum_multixact_freeze_min_age',
       'vacuum_multixact_freeze_table_age'].includes(paramName)) {
    return PARAM_CATEGORIES.AUTOVACUUM
  }
  
  // 超时相关
  if (['idle_in_transaction_session_timeout', 'statement_timeout',
       'tcp_keepalives_count', 'tcp_keepalives_idle', 'tcp_keepalives_interval'].includes(paramName)) {
    return PARAM_CATEGORIES.TIMEOUT
  }
  
  // 日志记录相关
  if (['log_destination', 'logging_collector', 'log_directory', 'log_filename',
       'log_truncate_on_rotation', 'log_min_messages', 'log_checkpoints',
       'log_lock_waits', 'log_connections', 'log_disconnections', 'log_line_prefix',
       'log_timezone', 'log_min_duration_statement', 'log_temp_files',
       'log_min_duration_sample', 'log_statement_sample_rate', 'lc_messages'].includes(paramName)) {
    return PARAM_CATEGORIES.LOGGING
  }
  
  // 其他参数
  return PARAM_CATEGORIES.OTHER
}

