/**
 * 剪贴板写入。Clipboard API 在非 HTTPS 或旧浏览器下不可用，
 * 这里统一带上 textarea + execCommand 的回退，避免每个调用点各写一遍。
 */
export async function copyToClipboard(text) {
	if (!text) {
		return false
	}

	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text)
			return true
		} catch (error) {
			// 权限被拒时继续走下面的回退，不直接判定失败
		}
	}

	try {
		const textArea = document.createElement('textarea')
		textArea.value = text
		textArea.setAttribute('readonly', '')
		textArea.style.position = 'fixed'
		textArea.style.left = '-9999px'
		document.body.appendChild(textArea)
		textArea.select()
		const ok = document.execCommand('copy')
		document.body.removeChild(textArea)
		return ok
	} catch (error) {
		console.error(error)
		return false
	}
}
