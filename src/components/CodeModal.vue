<template>
  <Teleport to="body">
    <div class="overlay" @click.self="$emit('close')">
      <div ref="dialogEl" class="dialog" role="dialog" aria-modal="true" :aria-labelledby="titleId" @keydown="onKeydown">
        <header class="dialog-head">
          <div>
            <h3 :id="titleId">{{ title }}</h3>
            <p v-if="hint" class="dialog-hint">{{ hint }}</p>
          </div>
          <button type="button" class="icon-btn" :aria-label="closeLabel" :title="closeLabel" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div class="dialog-body">
          <pre class="dialog-code" v-html="highlighted"></pre>
          <slot />
        </div>

        <footer class="dialog-foot">
          <span class="dialog-meta">{{ meta }}</span>
          <div class="dialog-actions">
            <button ref="copyEl" type="button" class="btn-primary" @click="onCopy">{{ copyState }}</button>
            <button type="button" class="btn-ghost" @click="$emit('close')">{{ closeLabel }}</button>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { copyToClipboard } from '../utils/clipboard'
import { getValueTone } from '../utils/displayTone'

let dialogSeq = 0

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

/**
 * 三种内容都是逐行结构（conf 的 key = value、SQL 的 ALTER SYSTEM、shell 命令），
 * 用逐行正则上色比引一个高亮库划算，参数值的配色也能跟表格保持一致。
 */
const highlightLine = (line) => {
  const safe = escapeHtml(line)

  if (/^\s*(#|--)/.test(safe)) {
    return `<span class="c-comment">${safe}</span>`
  }

  const sql = safe.match(/^(ALTER SYSTEM SET )([\w.]+)( = )(.+?)(;)$/)
  if (sql) {
    const [, keyword, name, eq, value, tail] = sql
    return `<span class="c-keyword">${keyword}</span><span class="c-name">${name}</span>${eq}<span class="c-${getValueTone(value.replace(/^'|'$/g, ''))}">${value}</span>${tail}`
  }

  const conf = safe.match(/^([\w.]+)( = )(.+)$/)
  if (conf) {
    const [, name, eq, value] = conf
    return `<span class="c-name">${name}</span>${eq}<span class="c-${getValueTone(value)}">${value}</span>`
  }

  const shell = safe.match(/^(\S+)(\s.*)$/)
  if (shell) {
    return `<span class="c-keyword">${shell[1]}</span>${shell[2]}`
  }

  return safe
}

export default {
  name: 'CodeModal',
  props: {
    title: { type: String, required: true },
    hint: { type: String, default: '' },
    code: { type: String, default: '' },
    meta: { type: String, default: '' },
    copyLabel: { type: String, default: 'Copy' },
    copiedLabel: { type: String, default: 'Copied' },
    failedLabel: { type: String, default: 'Copy failed' },
    closeLabel: { type: String, default: 'Close' }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const dialogEl = ref(null)
    const copyEl = ref(null)
    const copyState = ref(props.copyLabel)
    const titleId = `code-modal-title-${++dialogSeq}`
    const highlighted = computed(() => props.code.split('\n').map(highlightLine).join('\n'))
    let restoreFocusTo = null
    let resetTimer = null

    const onCopy = async () => {
      const ok = await copyToClipboard(props.code)
      copyState.value = ok ? props.copiedLabel : props.failedLabel
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        copyState.value = props.copyLabel
      }, 1600)
    }

    /** 弹窗内自锁 Tab 循环，否则焦点会跑到被遮罩盖住的页面元素上。 */
    const onKeydown = (event) => {
      if (event.key === 'Escape') {
        emit('close')
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const focusable = dialogEl.value?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) {
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    onMounted(() => {
      restoreFocusTo = document.activeElement
      document.body.style.overflow = 'hidden'
      copyEl.value?.focus()
    })

    onUnmounted(() => {
      clearTimeout(resetTimer)
      document.body.style.overflow = ''
      // 关闭后把焦点还给触发按钮，键盘用户不用从页首重新 Tab。
      if (restoreFocusTo instanceof HTMLElement) {
        restoreFocusTo.focus()
      }
    })

    return {
      dialogEl,
      copyEl,
      copyState,
      titleId,
      highlighted,
      onCopy,
      onKeydown
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: rgba(1, 4, 9, 0.75);
}

.dialog {
  display: flex;
  flex-direction: column;
  width: min(900px, 100%);
  max-height: min(84vh, 900px);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(1, 4, 9, 0.7);
  overflow: hidden;
}

.dialog-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.dialog-head h3 {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 600;
}

.dialog-hint {
  margin-top: 4px;
  max-width: 68ch;
  color: var(--text-dim);
  font-size: 0.78rem;
  line-height: 1.5;
}

.dialog-body {
  padding: var(--space-4);
  overflow: auto;
}

.dialog-code {
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.65;
  white-space: pre;
  overflow-x: auto;
  tab-size: 4;
  color: var(--text-dim);
}

.dialog-code :deep(.c-comment) {
  color: var(--tone-comment);
  font-style: italic;
}

.dialog-code :deep(.c-keyword) {
  color: var(--tone-keyword);
}

.dialog-code :deep(.c-name) {
  color: var(--text);
}

.dialog-code :deep(.c-num) {
  color: var(--tone-num);
}

.dialog-code :deep(.c-size) {
  color: var(--tone-size);
}

.dialog-code :deep(.c-time) {
  color: var(--tone-time);
}

.dialog-code :deep(.c-on) {
  color: var(--tone-on);
}

.dialog-code :deep(.c-off) {
  color: var(--tone-off);
}

.dialog-code :deep(.c-text) {
  color: var(--tone-text);
}

.dialog-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-top: 1px solid var(--border);
}

.dialog-meta {
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.dialog-actions {
  display: flex;
  gap: var(--space-2);
}

.icon-btn,
.btn-primary,
.btn-ghost {
  height: var(--control-height);
  border-radius: var(--radius);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background var(--ease), border-color var(--ease), color var(--ease);
}

.icon-btn {
  display: grid;
  place-items: center;
  width: var(--control-height);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-dim);
}

.icon-btn:hover {
  background: var(--surface-3);
  border-color: var(--border);
  color: var(--text);
}

.btn-primary {
  padding: 0 14px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-fg);
  font-weight: 500;
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

.btn-primary:active {
  background: #2b5fb0;
}

.btn-ghost {
  padding: 0 12px;
  border: 1px solid var(--border);
  background: var(--surface-3);
  color: var(--text);
}

.btn-ghost:hover {
  background: #2a313b;
  border-color: var(--border-strong);
}

.icon-btn:focus-visible,
.btn-primary:focus-visible,
.btn-ghost:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 1px;
}

@media (max-width: 640px) {
  .dialog-foot {
    flex-direction: column;
    align-items: stretch;
  }

  .dialog-actions {
    justify-content: flex-end;
  }
}
</style>
