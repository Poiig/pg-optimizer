/**
 * PostgreSQL 参数计算工具
 * 根据CPU核心数、内存大小和存储类型计算优化的PostgreSQL参数
 */

/**
 * 计算所有PostgreSQL参数
 * @param {Object} config - 配置对象
 * @param {string} config.dbVersion - PostgreSQL版本
 * @param {number} config.cpuCores - CPU核心数
 * @param {number} config.memoryGB - 内存大小(GB)
 * @param {string} config.storageType - 存储类型 ('ssd' 或 'hdd')
 * @returns {Array} 参数数组，每个元素包含 {name, value}
 */
export function calculateParams(config) {
  const { cpuCores, memoryGB, storageType } = config
  const memoryBytes = memoryGB * 1024 * 1024 * 1024 // 转换为字节
  const memoryMB = memoryGB * 1024 // 转换为MB

  const params = []

  // Autovacuum 相关参数
  params.push({ name: 'autovacuum', value: 'on' })
  params.push({ name: 'autovacuum_analyze_scale_factor', value: '0.05' })
  params.push({ name: 'autovacuum_analyze_threshold', value: '50' })
  params.push({ name: 'autovacuum_naptime', value: '15' })
  params.push({ name: 'autovacuum_vacuum_cost_delay', value: '2' })
  params.push({ name: 'autovacuum_vacuum_cost_limit', value: '200' })
  params.push({ name: 'autovacuum_vacuum_scale_factor', value: '0.05' })
  params.push({ name: 'autovacuum_vacuum_threshold', value: '50' })
  params.push({ name: 'log_autovacuum_min_duration', value: '10000' })
  params.push({ name: 'autovacuum_freeze_max_age', value: '200000000' })
  params.push({ name: 'autovacuum_multixact_freeze_max_age', value: '400000000' })
  
  // autovacuum_max_workers = LEAST(GREATEST(DBInstanceClassMemory/17179869184, 3), 10)
  const autovacuumMaxWorkers = Math.min(Math.max(Math.floor(memoryBytes / 17179869184), 3), 10)
  params.push({ name: 'autovacuum_max_workers', value: autovacuumMaxWorkers.toString() })
  
  // autovacuum_work_mem = GREATEST(DBInstanceClassMemory/65536, 131072) (转换为MB)
  const autovacuumWorkMemBytes = Math.max(Math.floor(memoryBytes / 65536), 131072)
  const autovacuumWorkMemMB = Math.floor(autovacuumWorkMemBytes / 1024 / 1024)
  params.push({ name: 'autovacuum_work_mem', value: `${autovacuumWorkMemMB}MB` })

  // Vacuum 相关参数
  params.push({ name: 'vacuum_cleanup_index_scale_factor', value: '0.1' })
  params.push({ name: 'vacuum_cost_limit', value: '10000' })
  params.push({ name: 'vacuum_cost_delay', value: '0' })
  params.push({ name: 'vacuum_cost_page_dirty', value: '20' })
  params.push({ name: 'vacuum_cost_page_hit', value: '1' })
  params.push({ name: 'vacuum_cost_page_miss', value: '2' })
  params.push({ name: 'vacuum_defer_cleanup_age', value: '0' })
  params.push({ name: 'vacuum_freeze_min_age', value: '50000000' })
  params.push({ name: 'vacuum_freeze_table_age', value: '200000000' })
  params.push({ name: 'vacuum_multixact_freeze_min_age', value: '5000000' })
  params.push({ name: 'vacuum_multixact_freeze_table_age', value: '200000000' })

  // WAL 相关参数
  params.push({ name: 'wal_sender_timeout', value: '5min' })
  params.push({ name: 'wal_compression', value: 'on' })
  params.push({ name: 'jit', value: 'off' })

  // 连接和超时相关参数
  params.push({ name: 'idle_in_transaction_session_timeout', value: '6min' })
  params.push({ name: 'statement_timeout', value: '5min' })
  params.push({ name: 'tcp_keepalives_count', value: '10' })
  params.push({ name: 'tcp_keepalives_idle', value: '45' })
  params.push({ name: 'tcp_keepalives_interval', value: '10' })

  // 核心性能参数
  // max_connections = 核心数 * 200
  const maxConnections = cpuCores * 200
  params.push({ name: 'max_connections', value: maxConnections.toString() })

  // shared_buffers = 内存四分之一 (转换为MB)
  const sharedBuffersMB = Math.floor(memoryMB / 4)
  params.push({ name: 'shared_buffers', value: `${sharedBuffersMB}MB` })

  // effective_cache_size = DBInstanceClassMemory/16384 (转换为MB，这个值通常是内存的3/4)
  // 但根据公式 DBInstanceClassMemory/16384，需要转换为MB
  // 16384 = 16KB，所以除以16384再乘以16KB = 内存大小，但通常设置为内存的3/4
  const effectiveCacheSizeMB = Math.floor(memoryMB * 3 / 4)
  params.push({ name: 'effective_cache_size', value: `${effectiveCacheSizeMB}MB` })

  // maintenance_work_mem = LEAST(DBInstanceClassMemory/65536, 4194304) (转换为MB)
  const maintenanceWorkMemBytes = Math.min(Math.floor(memoryBytes / 65536), 4194304)
  const maintenanceWorkMemMB = Math.floor(maintenanceWorkMemBytes / 1024 / 1024)
  params.push({ name: 'maintenance_work_mem', value: `${maintenanceWorkMemMB}MB` })

  params.push({ name: 'checkpoint_completion_target', value: '0.9' })

  // wal_buffers = LEAST(GREATEST(DBInstanceClassMemory/2097152, 2048), 16384)
  const walBuffers = Math.min(Math.max(Math.floor(memoryBytes / 2097152), 2048), 16384)
  params.push({ name: 'wal_buffers', value: `${walBuffers}kB` })

  params.push({ name: 'wal_keep_size', value: '2048MB' })
  params.push({ name: 'wal_writer_flush_after', value: '128' })
  params.push({ name: 'checkpoint_timeout', value: '6min' })
  params.push({ name: 'default_statistics_target', value: '100' })

  // random_page_cost 和 effective_io_concurrency 根据存储类型
  if (storageType === 'ssd') {
    params.push({ name: 'random_page_cost', value: '1.1' })
    params.push({ name: 'effective_io_concurrency', value: '200' })
  } else {
    params.push({ name: 'random_page_cost', value: '4' })
    params.push({ name: 'effective_io_concurrency', value: '2' })
  }

  // work_mem = GREATEST(DBInstanceClassMemory/4194304, 4096) (转换为MB)
  const workMemBytes = Math.max(Math.floor(memoryBytes / 4194304), 4096)
  const workMemMB = Math.floor(workMemBytes / 1024 / 1024)
  params.push({ name: 'work_mem', value: `${workMemMB}MB` })

  params.push({ name: 'huge_pages', value: 'try' })

  // min_wal_size = LEAST(GREATEST(DBInstanceClassMemory/8388608, 256), 8192)
  const minWalSizeMB = Math.min(Math.max(Math.floor(memoryBytes / 8388608 / 1024 / 1024), 256), 8192)
  params.push({ name: 'min_wal_size', value: `${minWalSizeMB}MB` })

  // max_wal_size = LEAST(GREATEST(DBInstanceClassMemory/2097152, 2048), 16384)
  const maxWalSizeMB = Math.min(Math.max(Math.floor(memoryBytes / 2097152 / 1024 / 1024), 2048), 16384)
  params.push({ name: 'max_wal_size', value: `${maxWalSizeMB}MB` })

  // 并行处理相关参数
  // max_worker_processes = 核心数 * 2
  const maxWorkerProcesses = cpuCores * 2
  params.push({ name: 'max_worker_processes', value: maxWorkerProcesses.toString() })

  // max_parallel_workers_per_gather = GREATEST(DBInstanceClassCPU/2, 2)
  const maxParallelWorkersPerGather = Math.max(Math.floor(cpuCores / 2), 2)
  params.push({ name: 'max_parallel_workers_per_gather', value: maxParallelWorkersPerGather.toString() })

  // max_parallel_workers = GREATEST(DBInstanceClassCPU*3/4, 8)
  const maxParallelWorkers = Math.max(Math.floor(cpuCores * 3 / 4), 8)
  params.push({ name: 'max_parallel_workers', value: maxParallelWorkers.toString() })

  // max_parallel_maintenance_workers = GREATEST(DBInstanceClassCPU/2, 2)
  const maxParallelMaintenanceWorkers = Math.max(Math.floor(cpuCores / 2), 2)
  params.push({ name: 'max_parallel_maintenance_workers', value: maxParallelMaintenanceWorkers.toString() })

  // Background writer 相关参数
  params.push({ name: 'bgwriter_lru_maxpages', value: '1000' })
  params.push({ name: 'bgwriter_lru_multiplier', value: '10' })

  // 其他优化参数
  params.push({ name: 'enable_partitionwise_aggregate', value: 'on' })
  params.push({ name: 'enable_partitionwise_join', value: 'on' })
  params.push({ name: 'extra_float_digits', value: '3' })
  params.push({ name: 'max_wal_senders', value: '16' })
  params.push({ name: 'superuser_reserved_connections', value: '20' })

  // temp_file_limit = DBInstanceClassMemory/1024 (转换为MB)
  const tempFileLimitMB = Math.floor(memoryBytes / 1024 / 1024 / 1024)
  params.push({ name: 'temp_file_limit', value: `${tempFileLimitMB}MB` })

  params.push({ name: 'track_functions', value: 'pl' })
  params.push({ name: 'track_io_timing', value: 'on' })
  params.push({ name: 'TimeZone', value: 'Asia/Shanghai' })
  params.push({ name: 'max_replication_slots', value: '16' })
  params.push({ name: 'max_stack_depth', value: '2048' })
  params.push({ name: 'lc_messages', value: 'en_US.UTF-8' })

  // 日志相关参数
  params.push({ name: 'log_destination', value: 'stderr' })
  params.push({ name: 'logging_collector', value: 'on' })
  params.push({ name: 'log_directory', value: 'pg_log' })
  params.push({ name: 'log_filename', value: 'postgresql-%d.log' })
  params.push({ name: 'log_truncate_on_rotation', value: 'on' })
  params.push({ name: 'log_min_messages', value: 'NOTICE' })
  params.push({ name: 'log_checkpoints', value: 'on' })
  params.push({ name: 'log_lock_waits', value: 'on' })
  params.push({ name: 'log_connections', value: 'off' })
  params.push({ name: 'log_disconnections', value: 'off' })
  params.push({ name: 'log_line_prefix', value: '%m [%p][%a] %u %d %r ' })
  params.push({ name: 'log_timezone', value: 'Asia/Shanghai' })
  params.push({ name: 'log_min_duration_statement', value: '5000ms' })
  params.push({ name: 'log_temp_files', value: '131072' })
  params.push({ name: 'log_min_duration_sample', value: '500ms' })
  params.push({ name: 'log_statement_sample_rate', value: '0.2' })

  return params
}

