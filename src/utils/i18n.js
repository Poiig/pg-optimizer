/**
 * 国际化配置
 */

export const translations = {
	zh: {
		// 页面标题
		title: 'PostgreSQL 性能参数优化工具',
		subtitle: '根据您的服务器配置自动生成优化的 PostgreSQL 参数',

		// 表单标签
		serverConfig: '服务器配置',
		dbVersion: 'PostgreSQL 版本',
		cpuCores: 'CPU 核心数',
		memoryGB: '内存 (GB)',
		storageType: '存储类型',
		ssd: 'SSD',
		hdd: '机械硬盘 (HDD)',
		generateConfig: '生成配置',
		placeholderCpu: '例如: 8',
		placeholderMemory: '例如: 32',

		// 结果区域
		generatedParams: '生成的配置参数',
		copyConfig: '复制配置',
		previewSQL: '生成并预览 ALTER SYSTEM SQL',

		// 表格列
		paramName: '参数名',
		paramValue: '参数值',
		restartRequired: '是否需要重启',
		description: '描述',
		yes: '是',
		no: '否',

		// 按钮和提示
		copied: '已复制！',
		copyFailed: '复制失败，请手动复制',
		noParams: '没有可复制的配置参数，请先生成配置',
		viewDoc: '查看官方文档',
		viewDocLink: '查看官方文档 →',

		// SQL 弹窗
		alterSystemSQL: 'ALTER SYSTEM SQL 语句',
		copySQL: '复制 SQL',
		sqlCopied: 'ALTER SYSTEM SQL 已复制到剪贴板！',

		// 参数描述默认文本
		paramDescriptionDefault: '该参数的详细说明请参考 PostgreSQL 官方文档',

		// 参数分类
		categoryPerformance: '性能相关参数',
		categoryAutovacuum: '自动清理相关配置',
		categoryTimeout: '超时相关',
		categoryLogging: '日志记录相关',
		categoryOther: '其他参数'
	},
	en: {
		// Page title
		title: 'PostgreSQL Performance Parameter Optimizer',
		subtitle: 'Automatically generate optimized PostgreSQL parameters based on your server configuration',

		// Form labels
		serverConfig: 'Server Configuration',
		dbVersion: 'PostgreSQL Version',
		cpuCores: 'CPU Cores',
		memoryGB: 'Memory (GB)',
		storageType: 'Storage Type',
		ssd: 'SSD',
		hdd: 'Hard Disk Drive (HDD)',
		generateConfig: 'Generate Configuration',
		placeholderCpu: 'e.g.: 8',
		placeholderMemory: 'e.g.: 32',

		// Result area
		generatedParams: 'Generated Configuration Parameters',
		copyConfig: 'Copy Configuration',
		previewSQL: 'Generate and Preview ALTER SYSTEM SQL',

		// Table columns
		paramName: 'Parameter Name',
		paramValue: 'Parameter Value',
		restartRequired: 'Restart Required',
		description: 'Description',
		yes: 'Yes',
		no: 'No',

		// Buttons and tips
		copied: 'Copied!',
		copyFailed: 'Copy failed, please copy manually',
		noParams: 'No parameters to copy, please generate configuration first',
		viewDoc: 'View Official Documentation',
		viewDocLink: 'View Official Documentation →',

		// SQL modal
		alterSystemSQL: 'ALTER SYSTEM SQL Statements',
		copySQL: 'Copy SQL',
		sqlCopied: 'ALTER SYSTEM SQL copied to clipboard!',

		// Parameter description default text
		paramDescriptionDefault: 'Please refer to PostgreSQL official documentation for detailed description of this parameter',

		// Parameter categories
		categoryPerformance: 'Performance Parameters',
		categoryAutovacuum: 'Autovacuum Configuration',
		categoryTimeout: 'Timeout Settings',
		categoryLogging: 'Logging Configuration',
		categoryOther: 'Other Parameters'
	}
}

// 参数分类映射
export const categoryMap = {
	'性能相关参数': {
		zh: '性能相关参数',
		en: 'Performance Parameters'
	},
	'自动清理相关配置': {
		zh: '自动清理相关配置',
		en: 'Autovacuum Configuration'
	},
	'超时相关': {
		zh: '超时相关',
		en: 'Timeout Settings'
	},
	'日志记录相关': {
		zh: '日志记录相关',
		en: 'Logging Configuration'
	},
	'其他参数': {
		zh: '其他参数',
		en: 'Other Parameters'
	}
}

/**
 * 获取分类的翻译名称
 * @param {string} category - 分类名称（中文）
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {string} 翻译后的分类名称
 */
export function getCategoryName(category, lang = 'zh') {
	return categoryMap[category]?.[lang] || category
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 * @returns {string} 翻译后的文本
 */
export function t(key, lang = 'zh') {
	return translations[lang]?.[key] || key
}

