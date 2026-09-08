/**
 * 参数重启信息按官方 context 划分。
 * 多数 GUC 是 sighup/user，只有 postmaster 级才需要重启；JIT/并行度被误标重启会吓跑使用者。
 */

const ALWAYS_RESTART = new Set([
	'shared_buffers',
	'wal_buffers',
	'max_connections',
	'superuser_reserved_connections',
	'reserved_connections',
	'max_worker_processes',
	'huge_pages',
	'huge_page_size',
	'max_wal_senders',
	'max_replication_slots',
	'wal_level',
	'logging_collector',
	'shared_preload_libraries',
	'dynamic_shared_memory_type',
	'max_prepared_transactions',
	'max_locks_per_transaction',
	'autovacuum_worker_slots',
	// 两个 freeze_max_age 是 postmaster 级，只能重启改；表级存储参数才能在线调小。
	'autovacuum_freeze_max_age',
	'autovacuum_multixact_freeze_max_age',
	'io_method'
])

/**
 * PG18 起 autovacuum_max_workers 改为 SIGHUP（配合 worker_slots）；更早版本仍是启动参数。
 */
export function isRestartRequired(paramName, dbVersion = '13') {
	if (paramName === 'autovacuum_max_workers') {
		return Number(dbVersion) < 18
	}
	return ALWAYS_RESTART.has(paramName)
}

/**
 * 获取参数是否需要重启的文本
 */
export function getRestartRequiredText(paramName, lang = 'zh', dbVersion = '13') {
	const yes = isRestartRequired(paramName, dbVersion)
	if (lang === 'en') {
		return yes ? 'Yes' : 'No'
	}
	return yes ? '是' : '否'
}
