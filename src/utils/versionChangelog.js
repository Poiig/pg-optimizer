/**
 * 各主版本相对上一版的官方 GUC 增删与语义变化。
 * 只收录本工具会输出、或调优时必须知道的项，避免把 release notes 整页搬上来。
 */
const CHANGELOG = {
  13: {
    added: [
      {
        name: 'hash_mem_multiplier',
        zh: '哈希表可用内存 = work_mem × 本参数。默认 1.0，与排序共用同一上限。',
        en: 'Hash table memory is work_mem times this value. Default 1.0, same cap as sorts.'
      },
      {
        name: 'maintenance_io_concurrency',
        zh: 'VACUUM、建索引等维护路径的预读并发。默认 10，比查询路径的 effective_io_concurrency 高。',
        en: 'Prefetch concurrency for VACUUM and index builds. Default 10, higher than query-path effective_io_concurrency.'
      }
    ],
    removed: [],
    changed: []
  },
  14: {
    added: [
      {
        name: 'compute_query_id',
        zh: '内核计算 query id。auto 会在加载 pg_stat_statements 时自动打开。',
        en: 'In-core query identifier. auto turns it on when pg_stat_statements is loaded.'
      },
      {
        name: 'idle_session_timeout',
        zh: '空闲且不在事务中的会话超时，用来回收泄漏连接。',
        en: 'Terminates sessions idle outside a transaction, reclaiming leaked connections.'
      },
      {
        name: 'client_connection_check_interval',
        zh: '查询执行期间检查客户端是否已断开，避免已断线客户端继续跑重查询。',
        en: 'Checks whether the client is still connected while a query runs.'
      },
      {
        name: 'track_wal_io_timing',
        zh: '统计 WAL I/O 耗时，配合 track_io_timing 看检查点写入。',
        en: 'Times WAL I/O so it can be read together with track_io_timing.'
      },
      {
        name: 'vacuum_failsafe_age',
        zh: 'XID 年龄逼近回卷时，VACUUM 取消限速、跳过非必要维护的最后手段。',
        en: 'Last-resort VACUUM mode that drops throttling when XID wraparound is close.'
      }
    ],
    removed: [
      {
        name: 'vacuum_cleanup_index_scale_factor',
        zh: 'B-tree 改为按已删除页比例自行判断是否做索引清理，本参数删除。',
        en: 'B-tree now decides index cleanup from the deleted-page ratio; this GUC is gone.'
      }
    ],
    changed: []
  },
  15: {
    added: [],
    removed: [],
    changed: [
      {
        name: 'wal_compression',
        zh: '由布尔改为算法名：off / pglz / lz4 / zstd。lz4 的 CPU 开销通常低于 pglz。',
        en: 'Became an algorithm name: off / pglz / lz4 / zstd. lz4 usually costs less CPU than pglz.'
      },
      {
        name: 'hash_mem_multiplier',
        zh: '官方默认由 1.0 改为 2.0，哈希节点可用两倍 work_mem，减少落盘。',
        en: 'Default raised from 1.0 to 2.0 so hash nodes get twice work_mem and spill less.'
      }
    ]
  },
  16: {
    added: [
      {
        name: 'vacuum_buffer_usage_limit',
        zh: '限制 VACUUM 使用的共享缓冲区环形大小，避免挤掉热数据。默认 256kB。',
        en: 'Caps the shared-buffer ring VACUUM may use so hot data stays cached. Default 256kB.'
      },
      {
        name: 'reserved_connections',
        zh: '为持有 pg_use_reserved_connections 的角色预留连接槽，需重启。',
        en: 'Connection slots reserved for roles with pg_use_reserved_connections. Restart required.'
      }
    ],
    removed: [
      {
        name: 'vacuum_defer_cleanup_age',
        zh: '延迟清理已改由 hot_standby_feedback 等机制处理，本参数删除。',
        en: 'Deferred cleanup is now handled by hot_standby_feedback and friends; this GUC is gone.'
      }
    ],
    changed: []
  },
  17: {
    added: [
      {
        name: 'io_combine_limit',
        zh: '相邻 I/O 合并后的最大大小，利于顺序扫描。默认 128kB。',
        en: 'Largest I/O size when combining adjacent requests. Default 128kB.'
      },
      {
        name: 'vacuum_max_eager_freeze_failure_rate',
        zh: 'eager freeze 扫描失败页占比上限，超过后本轮不再急冻。默认 0.03。',
        en: 'Caps the fraction of pages that may fail eager freeze before it is disabled. Default 0.03.'
      },
      {
        name: 'transaction_timeout',
        zh: '单事务最长存活时间，超时回滚。和 statement_timeout、空闲超时独立。',
        en: 'Maximum lifetime of a transaction; rolls it back on expiry, independent of statement_timeout.'
      }
    ],
    removed: [],
    changed: [
      {
        name: 'vacuum_buffer_usage_limit',
        zh: '官方默认由 256kB 提到 2MB。',
        en: 'Official default raised from 256kB to 2MB.'
      },
      {
        name: 'autovacuum_work_mem',
        zh: '死元组收集改用 TidStore，原先 1GB 的静默上限取消，设多大就会真正占用多大。',
        en: 'Dead-tuple storage moved to TidStore; the silent 1GB cap is gone and the setting is honored as written.'
      }
    ]
  },
  18: {
    added: [
      {
        name: 'autovacuum_worker_slots',
        zh: '为 autovacuum worker 预留的后端槽位，默认 16，只能重启改。之后 max_workers 可 reload。',
        en: 'Backend slots reserved for autovacuum workers. Default 16, restart only; max_workers can then reload.'
      },
      {
        name: 'autovacuum_vacuum_max_threshold',
        zh: '触发 VACUUM 的死元组数量上限，给超大表的比例因子封顶。默认 1 亿，-1 关闭。',
        en: 'Caps the dead-tuple count that can trigger VACUUM on huge tables. Default 100 million; -1 disables.'
      },
      {
        name: 'io_method',
        zh: '异步 I/O 机制：worker（默认）/ io_uring / sync。决定 effective_io_concurrency 如何真正发请求。',
        en: 'Async I/O method: worker (default) / io_uring / sync. Controls how effective_io_concurrency issues I/O.'
      },
      {
        name: 'io_workers',
        zh: 'io_method=worker 时的 I/O 工作进程数，默认 3。',
        en: 'I/O worker processes when io_method is worker. Default 3.'
      }
    ],
    removed: [],
    changed: [
      {
        name: 'effective_io_concurrency',
        zh: '官方默认由 1 改为 16。异步 I/O 落地后，它从 posix_fadvise 提示变成真实预读深度。',
        en: 'Default raised from 1 to 16. With real async I/O it is now actual prefetch depth, not just posix_fadvise.'
      },
      {
        name: 'maintenance_io_concurrency',
        zh: '官方默认由 10 改为 16，与查询路径对齐。',
        en: 'Default raised from 10 to 16 to match the query-path default.'
      },
      {
        name: 'log_connections',
        zh: '由布尔改为字符串列表（receipt / authentication / authorization 等），仍兼容 on/off。',
        en: 'Became a comma-separated list (receipt, authentication, authorization, …); on/off still accepted.'
      }
    ]
  }
}

const SUMMARY = {
  13: {
    zh: '相对 PG12：新增哈希内存倍数与维护 I/O 并发。本工具按云厂商 RDS 的 OLTP 公式给出推荐值。',
    en: 'New versus 12: hash memory multiplier and maintenance I/O concurrency. Recommendations follow the cloud RDS OLTP formulas.'
  },
  14: {
    zh: '新增 query id、空闲会话超时、客户端断线检测与 WAL I/O 计时；B-tree 索引清理参数被移除。',
    en: 'Adds query id, idle-session timeout, client-disconnect checks and WAL I/O timing; drops the B-tree index-cleanup scale factor.'
  },
  15: {
    zh: '无新的调优级 GUC。wal_compression 改为算法名，hash_mem_multiplier 默认提到 2.0。',
    en: 'No new tuning GUCs. wal_compression became an algorithm name; hash_mem_multiplier now defaults to 2.0.'
  },
  16: {
    zh: '新增 vacuum 缓冲占用上限与 reserved_connections；vacuum_defer_cleanup_age 被移除。',
    en: 'Adds a vacuum buffer-usage cap and reserved_connections; vacuum_defer_cleanup_age is gone.'
  },
  17: {
    zh: '新增 I/O 合并上限、eager freeze 失败率和事务超时；VACUUM 不再静默限制死元组内存 1GB。',
    en: 'Adds I/O combine limit, eager-freeze failure rate and transaction timeout; VACUUM no longer silently caps dead-tuple memory at 1GB.'
  },
  18: {
    zh: '异步 I/O 落地：新增 io_method / io_workers，以及 autovacuum 槽位与大表清理阈值；两个 I/O 并发默认都提到 16。',
    en: 'Async I/O landed: io_method / io_workers, plus autovacuum slots and a large-table vacuum cap. Both I/O concurrency defaults rose to 16.'
  }
}

/**
 * 取出指定主版本的官方变更，文案按界面语言展开。
 */
export function getVersionChangelog(version, lang = 'zh') {
  const major = parseInt(version, 10) || 13
  const entry = CHANGELOG[major] || { added: [], removed: [], changed: [] }
  const pick = (items) => items.map((item) => ({
    name: item.name,
    purpose: item[lang] || item.zh
  }))
  const summary = SUMMARY[major]
  return {
    version: major,
    summary: summary ? (summary[lang] || summary.zh) : '',
    added: pick(entry.added),
    removed: pick(entry.removed),
    changed: pick(entry.changed)
  }
}
