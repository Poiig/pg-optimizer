<template>
  <div class="page">
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <svg class="brand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
            <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
            <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
          </svg>
          <div class="brand-text">
            <h1>{{ t('title') }}</h1>
            <p class="subtitle">{{ t('subtitle') }}</p>
          </div>
        </div>

        <div class="topbar-actions">
          <a class="btn btn-quiet" :href="repoUrl" target="_blank" rel="noreferrer" :title="t('repoLink')">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span>{{ t('github') }}</span>
          </a>

          <div class="lang-dropdown">
            <button class="btn btn-quiet" type="button" :aria-expanded="langDropdownOpen" @click="toggleLangDropdown">
              <span>{{ currentLang === 'zh' ? '简体中文' : 'English' }}</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </button>
            <div v-if="langDropdownOpen" class="lang-menu" role="menu">
              <button type="button" class="lang-item" :class="{ active: currentLang === 'zh' }" role="menuitem" @click="selectLanguage('zh')">简体中文</button>
              <button type="button" class="lang-item" :class="{ active: currentLang === 'en' }" role="menuitem" @click="selectLanguage('en')">English</button>
            </div>
          </div>
        </div>
      </header>

      <div class="layout">
        <aside class="form-panel">
          <h2 class="panel-title">{{ t('serverConfig') }}</h2>
          <form class="config-form" @submit.prevent="generateConfig">
            <div class="field">
              <label for="dbVersion">{{ t('dbVersion') }}</label>
              <select id="dbVersion" v-model="config.dbVersion">
                <option v-for="version in dbVersions" :key="version" :value="version">PostgreSQL {{ version }}</option>
              </select>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="cpuCores">{{ t('cpuCores') }}</label>
                <input id="cpuCores" type="number" v-model.number="config.cpuCores" min="1" max="256" :placeholder="t('placeholderCpu')" />
              </div>
              <div class="field">
                <label for="memoryGB">{{ t('memoryGB') }}</label>
                <input id="memoryGB" type="number" v-model.number="config.memoryGB" min="1" max="1024" :placeholder="t('placeholderMemory')" />
              </div>
            </div>

            <div class="field">
              <label for="storageType">{{ t('storageType') }}</label>
              <select id="storageType" v-model="config.storageType">
                <option value="hdd">{{ t('hdd') }}</option>
                <option value="ssd">{{ t('ssd') }}</option>
                <option value="nvme">{{ t('nvme') }}</option>
              </select>
              <p class="hint">{{ t('storageHint') }}</p>
              <div v-if="config.storageType === 'hdd'" class="field">
                <label for="raidDataDisks">{{ t('raidDataDisks') }}</label>
                <input id="raidDataDisks" type="number" v-model.number="config.raidDataDisks" min="2" max="64" :placeholder="t('placeholderRaidDisks')" />
                <p class="hint">{{ t('raidDataDisksHint') }}</p>
              </div>
              <button type="button" class="link-btn" @click="openDiskProbeModal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 9-9" />
                  <path d="M12 12l4-6" />
                </svg>
                <span>{{ t('diskProbeCta') }}</span>
              </button>
            </div>

            <button type="submit" class="btn btn-primary btn-block">{{ t('generateConfig') }}</button>
            <p class="hint form-hint">{{ t('formHint') }}</p>
          </form>
        </aside>

        <section class="result-panel">
          <section class="version-note">
            <header class="note-head">
              <span class="note-version">PG{{ config.dbVersion }}</span>
              <p class="note-text">{{ changelog.summary }}</p>
              <button type="button" class="note-toggle" :aria-expanded="changelogOpen" @click="changelogOpen = !changelogOpen">
                <span>{{ changelogOpen ? t('logCollapse') : t('logExpand') }}</span>
                <span class="note-badge">{{ changelogTotal }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" :class="{ flip: changelogOpen }">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </header>

            <div v-if="changelogOpen" class="note-body">
              <div v-for="group in changelogGroups" :key="group.kind" class="diff-group">
                <h3 :class="`diff-${group.kind}`">
                  <span class="diff-sign" aria-hidden="true">{{ group.sign }}</span>
                  {{ group.label }}
                  <span class="diff-count">{{ group.items.length }}</span>
                </h3>
                <ul>
                  <li v-for="item in group.items" :key="item.name">
                    <div class="diff-line">
                      <code>{{ item.name }}</code>
                    </div>
                    <p class="diff-reason">{{ item.purpose }}</p>
                  </li>
                </ul>
              </div>
              <p v-if="!changelogTotal" class="note-empty">{{ t('logEmpty') }}</p>
              <p class="note-source">{{ t('sourceNote') }}</p>
            </div>
          </section>

          <div class="result-head">
            <div class="result-title">
              <h2>{{ t('generatedParams') }}</h2>
              <code class="spec">{{ summaryText }}</code>
            </div>
            <div class="result-actions">
              <button type="button" class="btn" @click="openOutputModal('conf')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
                  <polyline points="14 3 14 8 19 8" />
                  <line x1="8.5" y1="13" x2="15.5" y2="13" />
                  <line x1="8.5" y1="17" x2="13" y2="17" />
                </svg>
                <span>postgresql.conf</span>
              </button>
              <button type="button" class="btn" @click="openOutputModal('sql')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <ellipse cx="12" cy="6" rx="7" ry="2.6" />
                  <path d="M5 6v12c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6V6" />
                  <path d="M5 12c0 1.44 3.13 2.6 7 2.6s7-1.16 7-2.6" />
                </svg>
                <span>ALTER SYSTEM</span>
              </button>
            </div>
          </div>

          <div v-if="warnings.length" class="warning">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>{{ t('warnTitle') }}</strong>
              <p v-for="warning in warnings" :key="warning">{{ getWarningText(warning, currentLang) }}</p>
            </div>
          </div>

          <dl class="summary-bar">
            <div v-for="stat in statCards" :key="stat.label" class="summary-item">
              <dt>{{ stat.label }}</dt>
              <dd :class="stat.mono ? ['mono', `tone-${getValueTone(stat.value)}`] : stat.tone">{{ stat.value }}</dd>
            </div>
          </dl>

          <div class="toolbar">
            <div class="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input ref="searchInput" type="search" v-model="searchTerm" :placeholder="t('searchPlaceholder')" :aria-label="t('searchPlaceholder')" />
              <kbd v-if="!searchTerm">/</kbd>
            </div>

            <div class="chips" role="group" :aria-label="t('filterLabel')">
              <button type="button" class="chip" :class="{ active: activeCategory === 'all' }" :aria-pressed="activeCategory === 'all'" @click="activeCategory = 'all'">{{ t('filterAll') }}</button>
              <button
                v-for="category in categoryKeys"
                :key="category"
                type="button"
                class="chip"
                :class="[`cat-${getCategoryTone(category)}`, { active: activeCategory === category }]"
                :aria-pressed="activeCategory === category"
                @click="activeCategory = category"
              >
                <span class="dot" aria-hidden="true"></span>
                {{ getCategoryName(category, currentLang) }}
              </button>
              <button type="button" class="chip" :class="{ active: onlyRestart }" :aria-pressed="onlyRestart" @click="onlyRestart = !onlyRestart">
                <span class="dot dot-restart" aria-hidden="true"></span>
                {{ t('onlyRestart') }}
              </button>
            </div>

            <span class="count">{{ visibleCount }} / {{ generatedParams.length }}</span>
          </div>

          <div v-if="visibleCount" class="table-wrap">
            <table class="params">
              <thead>
                <tr>
                  <th>{{ t('paramName') }}</th>
                  <th>{{ t('paramValue') }}</th>
                  <th class="col-narrow">{{ t('restartRequired') }}</th>
                  <th class="col-narrow">{{ t('versionRange') }}</th>
                  <th>{{ t('description') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(group, category) in filteredGroups" :key="category">
                  <tr class="group-row" :class="`cat-${getCategoryTone(category)}`">
                    <th colspan="5" scope="colgroup">
                      <span class="group-bar" aria-hidden="true"></span>
                      {{ getCategoryName(category, currentLang) }}
                      <span class="group-count">{{ group.length }}</span>
                    </th>
                  </tr>
                  <tr v-for="param in group" :key="param.name">
                    <td class="cell-name">
                      <span>{{ param.name }}</span>
                      <a :href="getParamDocUrl(param.name, config.dbVersion)" target="_blank" rel="noreferrer" :title="`${t('viewDoc')}: ${param.name}`" :aria-label="`${t('viewDoc')}: ${param.name}`">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </td>
                    <td class="cell-value">
                      <input type="text" v-model="param.value" :class="`tone-${getValueTone(param.value)}`" :aria-label="param.name" spellcheck="false" @blur="updateParamValue(param.name, $event.target.value)" />
                    </td>
                    <td class="col-narrow">
                      <span class="restart" :class="isRestartRequired(param.name, config.dbVersion) ? 'restart-yes' : 'restart-no'">
                        <span class="dot" aria-hidden="true"></span>
                        {{ getRestartRequiredText(param.name, currentLang, config.dbVersion) }}
                      </span>
                    </td>
                    <td class="col-narrow">
                      <span v-if="getParamVersionLabel(param.since, param.until)" class="version">{{ getParamVersionLabel(param.since, param.until) }}</span>
                      <span v-else class="faint">—</span>
                    </td>
                    <td class="cell-desc" v-html="getParamDescription(param.name, currentLang) || t('paramDescriptionDefault')"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div v-else class="empty">
            <p>{{ t('noMatch') }}</p>
            <button type="button" class="btn" @click="resetFilters">{{ t('resetFilter') }}</button>
          </div>
        </section>
      </div>

      <footer class="footer">
        <p>{{ t('footerDisclaimer') }}</p>
        <nav>
          <a :href="repoUrl" target="_blank" rel="noreferrer">{{ t('github') }}</a>
          <a :href="`${repoUrl}/issues`" target="_blank" rel="noreferrer">{{ t('footerIssues') }}</a>
          <a :href="`https://www.postgresql.org/docs/${config.dbVersion}/runtime-config.html`" target="_blank" rel="noreferrer">{{ t('footerDocs') }}</a>
          <a :href="`${repoUrl}/blob/main/LICENSE`" target="_blank" rel="noreferrer">{{ t('footerLicense') }}</a>
        </nav>
      </footer>
    </div>

    <CodeModal
      v-if="activeModal"
      :title="activeModal.title"
      :hint="activeModal.hint"
      :code="activeModal.code"
      :meta="activeModal.meta"
      :copy-label="t('copy')"
      :copied-label="t('copied')"
      :failed-label="t('copyFailed')"
      :close-label="t('close')"
      @close="activeModal = null"
    >
      <ul v-if="activeModal.kind === 'disk'" class="notes">
        <li>{{ t('diskProbeDeps') }}</li>
        <li>{{ t('diskProbeInstall') }}</li>
        <li>{{ t('diskProbeDir') }}</li>
        <li><strong>{{ t('diskProbeMap') }}</strong></li>
        <li><a :href="`${repoUrl}/blob/main/${scriptName}`" target="_blank" rel="noreferrer">{{ t('viewScript') }}</a></li>
      </ul>
    </CodeModal>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { DB_VERSIONS, REPO_URL, REPO_RAW_URL, DISK_PROBE_SCRIPT } from './utils/constants'
import { calculateParams } from './utils/paramCalculator'
import { getVersionChangelog } from './utils/versionChangelog'
import { getParamDescription, getParamDocUrl } from './utils/paramDescriptions'
import { isRestartRequired, getRestartRequiredText } from './utils/paramRestartInfo'
import { translations, getCategoryName, getWarningText } from './utils/i18n'
import { getParamVersionLabel } from './utils/paramCategories'
import { getValueTone, getCategoryTone } from './utils/displayTone'
import { copyToClipboard } from './utils/clipboard'
import CodeModal from './components/CodeModal.vue'

const CATEGORY_ORDER = ['性能相关参数', '自动清理相关配置', '超时相关', '日志记录相关', '其他参数']

export default {
  name: 'App',
  components: { CodeModal },
  setup() {
    const currentLang = ref('zh')
    const langDropdownOpen = ref(false)
    const dbVersions = DB_VERSIONS
    const repoUrl = REPO_URL
    const scriptName = DISK_PROBE_SCRIPT

    const searchInput = ref(null)
    const searchTerm = ref('')
    const activeCategory = ref('all')
    const onlyRestart = ref(false)
    const activeModal = ref(null)

    const t = (key) => translations[currentLang.value]?.[key] || key

    const config = reactive({
      dbVersion: '13',
      cpuCores: 8,
      memoryGB: 32,
      storageType: 'ssd',
      raidDataDisks: null
    })

    const generatedParams = ref([])
    const warnings = ref([])

    /** 按固定分类顺序分组，保证表格和导出文本的章节顺序一致。 */
    const groupParams = (params) => {
      const groups = {}
      params.forEach((param) => {
        const category = param.category || '其他参数'
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(param)
      })
      const ordered = {}
      CATEGORY_ORDER.forEach((category) => {
        if (groups[category]) {
          ordered[category] = groups[category]
        }
      })
      Object.keys(groups).forEach((category) => {
        if (!ordered[category]) {
          ordered[category] = groups[category]
        }
      })
      return ordered
    }

    const groupedParams = computed(() => groupParams(generatedParams.value))
    const categoryKeys = computed(() => Object.keys(groupedParams.value))

    /** 描述里带 HTML 标签，搜索前去掉标签，否则输入 br、code 之类会命中所有行。 */
    const plainDescription = (name) => {
      const html = getParamDescription(name, currentLang.value) || ''
      return html.replace(/<[^>]*>/g, '').toLowerCase()
    }

    const filteredParams = computed(() => {
      const keyword = searchTerm.value.trim().toLowerCase()
      return generatedParams.value.filter((param) => {
        if (activeCategory.value !== 'all' && param.category !== activeCategory.value) {
          return false
        }
        if (onlyRestart.value && !isRestartRequired(param.name, config.dbVersion)) {
          return false
        }
        if (!keyword) {
          return true
        }
        return param.name.toLowerCase().includes(keyword) ||
          String(param.value).toLowerCase().includes(keyword) ||
          plainDescription(param.name).includes(keyword)
      })
    })

    const filteredGroups = computed(() => groupParams(filteredParams.value))
    const visibleCount = computed(() => filteredParams.value.length)

    const changelogOpen = ref(true)

    /** 官方该版本相对上一版的 GUC 增删，与本工具推荐值是否改过无关。 */
    const changelog = computed(() => getVersionChangelog(config.dbVersion, currentLang.value))

    const changelogGroups = computed(() => {
      const log = changelog.value
      return [
        { kind: 'added', sign: '+', label: t('logAdded'), items: log.added },
        { kind: 'changed', sign: '~', label: t('logChanged'), items: log.changed },
        { kind: 'removed', sign: '−', label: t('logRemoved'), items: log.removed }
      ].filter((group) => group.items.length)
    })

    const changelogTotal = computed(() => changelogGroups.value.reduce((sum, group) => sum + group.items.length, 0))

    /** 结果区标题旁的规格摘要，切换版本时确认当前算的是哪套输入。 */
    const summaryText = computed(() => {
      const storage = t(config.storageType)
      const raid = config.storageType === 'hdd' && Number(config.raidDataDisks) >= 2
        ? ` RAID×${config.raidDataDisks}`
        : ''
      return `PG${config.dbVersion} · ${config.cpuCores}C · ${config.memoryGB}GB · ${storage}${raid}`
    })

    const paramValue = (name) => generatedParams.value.find((param) => param.name === name)?.value || '—'

    /** 概要条挑的是决定内存占用和连接规模的几项，先看这几个再翻表格。 */
    const statCards = computed(() => {
      const restartCount = generatedParams.value.filter((param) => isRestartRequired(param.name, config.dbVersion)).length
      return [
        { label: t('statTotal'), value: String(generatedParams.value.length) },
        { label: t('statRestart'), value: String(restartCount), tone: restartCount ? 'tone-restart' : '' },
        { label: 'shared_buffers', value: paramValue('shared_buffers'), mono: true },
        { label: 'effective_cache_size', value: paramValue('effective_cache_size'), mono: true },
        { label: 'work_mem', value: paramValue('work_mem'), mono: true },
        { label: 'max_connections', value: paramValue('max_connections'), mono: true }
      ]
    })

    /**
     * ALTER SYSTEM 的值转义：纯数字不加引号，其余当字面量。
     */
    const escapeValue = (value) => {
      const str = String(value).trim()
      if (/^-?\d+(\.\d+)?$/.test(str)) {
        return str
      }
      return `'${str.replace(/'/g, "''")}'`
    }

    /** 把分组参数渲染成 conf 或 SQL，避免两套导出各写一遍循环。 */
    const buildGroupedLines = (formatter) => {
      const groups = groupedParams.value
      const lines = []
      CATEGORY_ORDER.forEach((category) => {
        if (!groups[category]?.length) {
          return
        }
        lines.push(formatter.header(getCategoryName(category, currentLang.value)))
        groups[category].forEach((param) => {
          lines.push(formatter.line(param))
        })
        lines.push('')
      })
      return lines.join('\n').trim()
    }

    const confText = computed(() => {
      return buildGroupedLines({
        header: (name) => `# ${name}`,
        line: (param) => `${param.name} = ${param.value}`
      })
    })

    const sqlText = computed(() => {
      return buildGroupedLines({
        header: (name) => `-- ${name}`,
        line: (param) => `ALTER SYSTEM SET ${param.name} = ${escapeValue(param.value)};`
      })
    })

    const diskProbeCommand = computed(() => {
      return [
        `curl -fsSL ${REPO_RAW_URL}/${DISK_PROBE_SCRIPT} -o ${DISK_PROBE_SCRIPT}`,
        `bash ${DISK_PROBE_SCRIPT} -d /var/lib/postgresql/data`
      ].join('\n')
    })

    const generateConfig = () => {
      const result = calculateParams(config)
      generatedParams.value = result.params
      warnings.value = result.warnings
    }

    /** 表格里改过的值要落回 generatedParams，导出文本读的是同一份数据。 */
    const updateParamValue = (name, value) => {
      const target = generatedParams.value.find((param) => param.name === name)
      if (target) {
        target.value = value
      }
    }

    const resetFilters = () => {
      searchTerm.value = ''
      activeCategory.value = 'all'
      onlyRestart.value = false
    }

    /** 复制同时弹窗展示全文：剪贴板不可用时用户还能从弹窗里手动选中。 */
    const openOutputModal = async (kind) => {
      const code = kind === 'conf' ? confText.value : sqlText.value
      if (!code) {
        alert(t('noParams'))
        return
      }
      const copied = await copyToClipboard(code)
      const baseHint = kind === 'conf' ? t('confHint') : t('sqlHint')
      activeModal.value = {
        kind,
        title: kind === 'conf' ? t('confTitle') : t('sqlTitle'),
        hint: copied ? `${baseHint} ${t('autoCopied')}` : baseHint,
        code,
        meta: `${code.split('\n').length} ${t('linesSuffix')} · ${generatedParams.value.length} ${t('paramsSuffix')}`
      }
    }

    const openDiskProbeModal = () => {
      activeModal.value = {
        kind: 'disk',
        title: t('diskProbe'),
        hint: t('diskProbeHint'),
        code: diskProbeCommand.value,
        meta: t('diskProbeNotes')
      }
    }

    const selectLanguage = (lang) => {
      currentLang.value = lang
      langDropdownOpen.value = false
    }

    const toggleLangDropdown = () => {
      langDropdownOpen.value = !langDropdownOpen.value
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.lang-dropdown')) {
        langDropdownOpen.value = false
      }
    }

    /** 参数有几十行，"/" 直接跳到搜索框，省得每次都去点。 */
    const handleShortcut = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || activeModal.value) {
        return
      }
      event.preventDefault()
      searchInput.value?.focus()
    }

    watch(config, generateConfig, { deep: true })

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleShortcut)
      generateConfig()
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleShortcut)
    })

    return {
      config,
      dbVersions,
      repoUrl,
      scriptName,
      generatedParams,
      filteredGroups,
      categoryKeys,
      visibleCount,
      warnings,
      searchInput,
      searchTerm,
      activeCategory,
      onlyRestart,
      activeModal,
      currentLang,
      langDropdownOpen,
      changelog,
      changelogOpen,
      changelogGroups,
      changelogTotal,
      summaryText,
      statCards,
      t,
      getCategoryName,
      getWarningText,
      getParamDescription,
      getParamDocUrl,
      getParamVersionLabel,
      getValueTone,
      getCategoryTone,
      isRestartRequired,
      getRestartRequiredText,
      generateConfig,
      updateParamValue,
      resetFilters,
      openOutputModal,
      openDiskProbeModal,
      selectLanguage,
      toggleLangDropdown
    }
  }
}
</script>

<style scoped>
.app-shell {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* ---------- 顶栏 ---------- */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.brand-icon {
  flex: none;
  color: var(--cat-perf);
}

.brand h1 {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.subtitle {
  color: var(--text-faint);
  font-size: 0.78rem;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* ---------- 按钮 ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--control-height);
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-3);
  color: var(--text);
  font-size: 0.82rem;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--ease), border-color var(--ease), color var(--ease);
}

.btn:hover {
  background: #2a313b;
  border-color: var(--border-strong);
}

.btn:active {
  background: var(--surface-2);
}

.btn svg {
  color: var(--text-dim);
}

.btn:hover svg {
  color: var(--text);
}

.btn-quiet {
  background: transparent;
  border-color: transparent;
  color: var(--text-dim);
}

.btn-quiet:hover {
  background: var(--surface-3);
  border-color: var(--border);
  color: var(--text);
}

.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
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

.btn-primary svg,
.btn-primary:hover svg {
  color: currentColor;
}

.btn-block {
  width: 100%;
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  padding: 4px 0;
  border: 0;
  background: none;
  color: var(--link);
  font-size: 0.78rem;
  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}

.btn:focus-visible,
.link-btn:focus-visible,
.chip:focus-visible,
.lang-item:focus-visible,
input:focus-visible,
select:focus-visible,
.footer a:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 1px;
}

/* ---------- 语言切换 ---------- */
.lang-dropdown {
  position: relative;
}

.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 130px;
  padding: 4px;
  background: var(--surface-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(1, 4, 9, 0.6);
  z-index: 20;
}

.lang-item {
  display: block;
  width: 100%;
  padding: 7px 10px;
  border: 0;
  border-radius: 4px;
  background: none;
  color: var(--text);
  font-size: 0.82rem;
  text-align: left;
  cursor: pointer;
}

.lang-item:hover {
  background: var(--surface-2);
}

.lang-item.active {
  color: var(--link);
}

/* ---------- 布局 ---------- */
.layout {
  display: grid;
  grid-template-columns: 272px minmax(0, 1fr);
}

.form-panel {
  padding: var(--space-4);
  background: var(--surface-2);
  border-right: 1px solid var(--border);
}

.panel-title {
  margin-bottom: var(--space-4);
  color: var(--text-faint);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.field label {
  color: var(--text-dim);
  font-size: 0.78rem;
  font-weight: 500;
}

.field input,
.field select,
.search input {
  height: var(--control-height);
  padding: 0 9px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text);
  font-size: 0.85rem;
  transition: border-color var(--ease), box-shadow var(--ease);
}

.field input:hover,
.field select:hover {
  border-color: var(--border-strong);
}

.field input:focus,
.field select:focus,
.search input:focus {
  border-color: var(--accent-hover);
  box-shadow: 0 0 0 3px rgba(49, 109, 202, 0.25);
  outline: none;
}

.field select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12' fill='none' stroke='%239198a1' stroke-width='2'%3E%3Cpath d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 26px;
}

.hint {
  color: var(--text-faint);
  font-size: 0.75rem;
  line-height: 1.45;
}

.form-hint {
  padding-top: var(--space-2);
  border-top: 1px solid var(--border);
}

/* ---------- 结果区 ---------- */
.result-panel {
  padding: var(--space-4);
  min-width: 0;
}

/* ---------- 版本差异 ---------- */
.version-note {
  margin-bottom: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-2);
}

.note-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 9px var(--space-3);
}

.note-version {
  flex: none;
  padding: 2px 7px;
  border: 1px solid rgba(88, 166, 255, 0.32);
  border-radius: 4px;
  background: rgba(88, 166, 255, 0.1);
  color: var(--cat-perf);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
}

.note-text {
  flex: 1;
  min-width: 0;
  color: var(--text-dim);
  font-size: 0.8rem;
  line-height: 1.5;
}

.note-empty {
  flex: 1 1 100%;
  color: var(--text-faint);
  font-size: 0.76rem;
}

.note-toggle {
  display: flex;
  flex: none;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text-dim);
  font-size: 0.76rem;
  cursor: pointer;
}

.note-toggle:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

.note-toggle svg {
  transition: transform 0.15s ease;
}

.note-toggle svg.flip {
  transform: rotate(180deg);
}

.note-badge {
  padding: 0 5px;
  border-radius: 8px;
  background: var(--surface-3);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

/* auto-fit 会按最小宽度铺满可用轨道，三组只占左侧一部分，右边空一大片；
   用 flex 让实际存在的分组均分整行。 */
.note-body {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3) var(--space-4);
  padding: var(--space-3);
  border-top: 1px solid var(--border);
}

.diff-group {
  flex: 1 1 240px;
  min-width: 0;
}

.diff-group h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
  color: var(--text-faint);
  font-size: 0.74rem;
  font-weight: 600;
}

.diff-sign {
  font-family: var(--font-mono);
  font-size: 0.86rem;
}

.diff-group h3.diff-added .diff-sign {
  color: var(--ok);
}

.diff-group h3.diff-changed .diff-sign {
  color: var(--warn);
}

.diff-group h3.diff-removed .diff-sign {
  color: var(--text-dim);
}

.diff-count {
  padding: 0 5px;
  border-radius: 8px;
  background: var(--surface-3);
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

.diff-group li {
  padding: 5px 0;
  border-top: 1px solid var(--border);
}

.diff-group li:first-child {
  border-top: none;
}

.diff-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.diff-line code {
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.76rem;
}

.diff-move,
.diff-val {
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.diff-move {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  color: var(--text-faint);
}

.diff-move s,
s.diff-val {
  color: var(--text-faint);
  text-decoration-thickness: 1px;
}

.diff-reason {
  margin-top: 1px;
  color: var(--text-faint);
  font-size: 0.72rem;
  line-height: 1.45;
}

.note-source {
  flex: 1 1 100%;
  padding-top: var(--space-2);
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 0.72rem;
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}

.result-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.result-title h2 {
  font-size: 0.95rem;
  font-weight: 600;
}

.spec {
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.result-actions {
  display: flex;
  gap: var(--space-2);
}

.warning {
  display: flex;
  gap: var(--space-3);
  padding: 10px var(--space-3);
  margin-bottom: var(--space-3);
  border: 1px solid #6b4708;
  border-left-width: 3px;
  border-radius: var(--radius);
  background: rgba(210, 153, 34, 0.08);
  color: #e3b341;
  font-size: 0.82rem;
}

.warning svg {
  flex: none;
  margin-top: 2px;
}

.warning strong {
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
}

/* ---------- 概要条 ---------- */
.summary-bar {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-2);
  margin-bottom: var(--space-3);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 128px;
  padding: 9px var(--space-3);
  border-left: 1px solid var(--border);
}

.summary-item:first-child {
  border-left: 0;
}

.summary-item dt {
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.summary-item dd {
  font-size: 0.95rem;
  font-weight: 600;
}

.summary-item dd.mono {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 500;
}

.summary-item dd.tone-restart {
  color: var(--warn);
}

/* ---------- 取值配色 ---------- */
.tone-num {
  color: var(--tone-num);
}

.tone-size {
  color: var(--tone-size);
}

.tone-time {
  color: var(--tone-time);
}

.tone-on {
  color: var(--tone-on);
}

.tone-off {
  color: var(--tone-off);
}

.tone-text {
  color: var(--tone-text);
}

/* ---------- 工具栏 ---------- */
.toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-2);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 260px;
  color: var(--text-faint);
}

.search svg {
  position: absolute;
  left: 9px;
  pointer-events: none;
}

.search input {
  width: 100%;
  padding-left: 29px;
  padding-right: 30px;
}

.search input::-webkit-search-cancel-button {
  filter: grayscale(1);
}

.search kbd {
  position: absolute;
  right: 8px;
  padding: 1px 5px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface-3);
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  pointer-events: none;
}

.chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: transparent;
  color: var(--text-dim);
  font-size: 0.78rem;
  cursor: pointer;
  transition: background var(--ease), border-color var(--ease), color var(--ease);
}

.chip:hover {
  border-color: var(--border-strong);
  color: var(--text);
}

/* 分类按钮和分组行共用同一色相，两边靠颜色对上而不用再读文字。 */
.cat-perf {
  --cat: var(--cat-perf);
}

.cat-vacuum {
  --cat: var(--cat-vacuum);
}

.cat-timeout {
  --cat: var(--cat-timeout);
}

.cat-log {
  --cat: var(--cat-log);
}

.cat-other {
  --cat: var(--cat-other);
}

.chip .dot {
  background: var(--cat, var(--text-faint));
}

.chip .dot-restart {
  background: var(--danger);
}

.chip.active {
  background: rgba(49, 109, 202, 0.18);
  border-color: var(--accent);
  color: #adcbf5;
}

.chip.cat-perf.active,
.chip.cat-vacuum.active,
.chip.cat-timeout.active,
.chip.cat-log.active,
.chip.cat-other.active {
  background: color-mix(in srgb, var(--cat) 16%, transparent);
  border-color: color-mix(in srgb, var(--cat) 60%, transparent);
  color: var(--cat);
}

.count {
  margin-left: auto;
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.76rem;
}

/* ---------- 参数表 ---------- */
.table-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  max-height: calc(100vh - 330px);
  min-height: 300px;
  overflow: auto;
}

.params {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.82rem;
}

/* 表头与分组行都要吸顶，高度写死才能让分组行的 top 正好接在表头下沿。 */
.params thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 34px;
  padding: 0 12px;
  background: var(--surface-3);
  border-bottom: 1px solid var(--border-strong);
  color: var(--text-dim);
  font-size: 0.74rem;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
}

.col-narrow {
  width: 86px;
  text-align: center !important;
}

.group-row th {
  position: sticky;
  top: 34px;
  z-index: 1;
  padding: 6px 12px;
  background: color-mix(in srgb, var(--cat, var(--text-faint)) 7%, var(--surface-2));
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: 0.74rem;
  font-weight: 600;
  text-align: left;
}

.group-bar {
  display: inline-block;
  width: 3px;
  height: 11px;
  margin-right: 8px;
  border-radius: 2px;
  background: var(--cat, var(--text-faint));
  vertical-align: -1px;
}

.group-count {
  margin-left: 6px;
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-weight: 400;
}

.params tbody tr:not(.group-row):hover td {
  background: rgba(110, 118, 129, 0.08);
}

.params td {
  padding: 5px 12px;
  border-bottom: 1px solid rgba(48, 54, 61, 0.6);
  vertical-align: middle;
}

.cell-name {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  white-space: nowrap;
}

.cell-name a {
  margin-left: 6px;
  color: transparent;
  vertical-align: middle;
  display: inline-flex;
  transition: color var(--ease);
}

.cell-name:hover a,
.cell-name a:focus-visible {
  color: var(--link);
}

.cell-value {
  width: 150px;
}

/* 参数值默认看着像文本，hover/focus 才露出输入框边界，表格不会被一排框割裂。
   这里不设 color，交给 .tone-* 按值类型上色。 */
.cell-value input {
  width: 100%;
  height: 28px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  transition: border-color var(--ease), background var(--ease);
}

.cell-value input:hover {
  border-color: var(--border);
  background: var(--bg);
}

.cell-value input:focus {
  border-color: var(--accent-hover);
  background: var(--bg);
  box-shadow: 0 0 0 2px rgba(49, 109, 202, 0.25);
  outline: none;
}

.cell-desc {
  color: var(--text-dim);
  font-size: 0.78rem;
  line-height: 1.5;
}

/* 说明里的加粗是"注意事项"，用琥珀色而不是刺眼的纯红。 */
.cell-desc :deep(b) {
  color: var(--warn);
  font-weight: 600;
}

.restart {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dot-restart {
  background: var(--danger);
}

.restart-yes {
  color: #e5837d;
}

.restart-no {
  color: var(--text-dim);
}

/* 只有版本区间不是 13–18 的参数才带徽章，用蓝色提示"这一项跟版本有关"。 */
.version {
  display: inline-block;
  padding: 1px 6px;
  border: 1px solid rgba(88, 166, 255, 0.4);
  border-radius: 10px;
  background: rgba(88, 166, 255, 0.1);
  color: var(--tone-num);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.faint {
  color: var(--text-faint);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
}

/* ---------- 页脚 ---------- */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding: var(--space-3) var(--space-4);
  background: var(--surface-2);
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 0.76rem;
}

.footer nav {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.footer a {
  color: var(--text-dim);
  text-decoration: none;
}

.footer a:hover {
  color: var(--link);
  text-decoration: underline;
}

.notes {
  margin: var(--space-3) 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--text-dim);
  font-size: 0.8rem;
  line-height: 1.5;
}

.notes a {
  color: var(--link);
}

@media (max-width: 1080px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .form-panel {
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .config-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-items: end;
  }

  .table-wrap {
    max-height: none;
  }
}

@media (max-width: 720px) {
  .result-head,
  .footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .field-row,
  .config-form {
    grid-template-columns: 1fr;
  }

  .count {
    margin-left: 0;
  }

  .summary-item {
    flex-basis: 50%;
    border-left: 0;
  }
}
</style>
