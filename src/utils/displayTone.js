/**
 * 展示用的色彩语义。表格、概要条、导出预览三处共用同一套判定，
 * 参数值的颜色跟着"值是什么类型"走，扫一眼就能分出开关、容量和时长。
 */

const BOOL_ON = /^(on|true|yes|try)$/i
const BOOL_OFF = /^(off|false|no)$/i
const SIZE = /^-?\d+(\.\d+)?\s?(kb|mb|gb|tb)$/i
const TIME = /^-?\d+(\.\d+)?\s?(us|ms|s|min|h|d)$/i
const NUMBER = /^-?\d+(\.\d+)?$/

export function getValueTone(value) {
	const text = String(value ?? '').trim()
	if (BOOL_ON.test(text)) {
		return 'on'
	}
	if (BOOL_OFF.test(text)) {
		return 'off'
	}
	if (SIZE.test(text)) {
		return 'size'
	}
	if (TIME.test(text)) {
		return 'time'
	}
	if (NUMBER.test(text)) {
		return 'num'
	}
	return 'text'
}

/**
 * 分类 key 是中文，不能直接当 class 名，这里翻成固定的色相槽位。
 */
const CATEGORY_TONE = {
	'性能相关参数': 'perf',
	'自动清理相关配置': 'vacuum',
	'超时相关': 'timeout',
	'日志记录相关': 'log'
}

export function getCategoryTone(category) {
	return CATEGORY_TONE[category] || 'other'
}
