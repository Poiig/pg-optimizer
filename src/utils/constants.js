/**
 * 覆盖的 PostgreSQL 主版本。默认 13，与本工具的生产基线一致。
 */
export const DB_VERSIONS = ['13', '14', '15', '16', '17', '18']
export const DEFAULT_DB_VERSION = '13'

/**
 * 仓库地址在顶栏、页脚和磁盘探测脚本的下载命令里都要用，集中一份避免改仓库时漏改。
 */
export const REPO_URL = 'https://github.com/Poiig/pg-optimizer'
export const REPO_RAW_URL = 'https://raw.githubusercontent.com/Poiig/pg-optimizer/main'
export const DISK_PROBE_SCRIPT = 'detect_disk_type.sh'
