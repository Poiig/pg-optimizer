/**
 * 参数重启信息
 * 定义哪些参数需要重启PostgreSQL服务才能生效
 * 注意：大部分参数可以通过 SELECT pg_reload_conf() 生效，不需要重启服务
 */

// 需要重启服务的参数列表（只有这些参数需要重启PostgreSQL服务）
// 根据PostgreSQL官方文档，这些参数只能通过服务器启动时设置
// 其他参数都可以通过 SELECT pg_reload_conf() 生效
const restartRequiredParams = [
	'shared_buffers',              // 共享缓冲区大小 - can only be set at server start
	'max_connections',             // 最大连接数 - 影响共享内存分配，需要重启
	'max_worker_processes',        // 最大工作进程数 - can only be set at server start
	'max_parallel_workers',        // 最大并行工作进程数 - can only be set at server start
	'max_parallel_workers_per_gather',  // 每个Gather节点的最大并行工作进程数 - can only be set at server start
	'max_parallel_maintenance_workers', // 最大并行维护工作进程数 - can only be set at server start
	'max_wal_senders',             // 最大WAL发送进程数 - can only be set at server start
	'max_replication_slots',        // 最大复制槽数 - can only be set at server start
	'wal_level',                   // WAL级别 - requires server restart
	'wal_log_hints',               // WAL日志提示 - requires server restart
	'max_stack_depth',             // 最大堆栈深度 - can only be set at server start
	'dynamic_shared_memory_type',  // 动态共享内存类型 - can only be set at server start
	'huge_pages',                  // 大页内存 - can only be set at server start
	'max_prepared_transactions',   // 最大预备事务数 - can only be set at server start
	'shared_preload_libraries',    // 共享预加载库 - requires server restart
	'jit',                         // JIT编译 - requires server restart
	'autovacuum_max_workers'       // 最大自动清理工作进程数 - can only be set at server start
]

/**
 * 判断参数是否需要重启
 * @param {string} paramName - 参数名
 * @returns {boolean} 是否需要重启
 */
export function isRestartRequired(paramName) {
	return restartRequiredParams.includes(paramName)
}

/**
 * 获取参数是否需要重启的文本
 * @param {string} paramName - 参数名
 * @returns {string} "是" 或 "否"
 */
export function getRestartRequiredText(paramName) {
	return isRestartRequired(paramName) ? '是' : '否'
}

