<template>
  <div class="app-container">
    <header class="header">
      <h1>PostgreSQL 性能参数优化工具</h1>
      <p class="subtitle">根据您的服务器配置自动生成优化的 PostgreSQL 参数</p>
    </header>

    <div class="main-content">
      <div class="input-section">
        <h2>服务器配置</h2>
        <form @submit.prevent="generateConfig" class="config-form">
          <div class="form-group">
            <label for="dbVersion">PostgreSQL 版本</label>
            <select id="dbVersion" v-model="config.dbVersion" required>
              <option value="13">PostgreSQL 13</option>
              <option value="14">PostgreSQL 14</option>
              <option value="15">PostgreSQL 15</option>
              <option value="16">PostgreSQL 16</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cpuCores">CPU 核心数</label>
            <input
              id="cpuCores"
              type="number"
              v-model.number="config.cpuCores"
              min="1"
              max="256"
              required
              placeholder="例如: 8"
            />
          </div>

          <div class="form-group">
            <label for="memoryGB">内存 (GB)</label>
            <input
              id="memoryGB"
              type="number"
              v-model.number="config.memoryGB"
              min="1"
              max="1024"
              required
              placeholder="例如: 32"
            />
          </div>

          <div class="form-group">
            <label for="storageType">存储类型</label>
            <select id="storageType" v-model="config.storageType" required>
              <option value="ssd">SSD</option>
              <option value="hdd">机械硬盘 (HDD)</option>
            </select>
          </div>

          <button type="submit" class="generate-btn">生成配置</button>
        </form>
      </div>

      <div class="result-section" v-if="generatedParams.length > 0">
        <div class="result-header">
          <h2>生成的配置参数</h2>
          <div class="action-buttons">
            <button @click="copyToClipboard" class="btn-secondary" id="copyBtn">复制配置</button>
            <button @click="copyAlterSystemSQL" class="btn-secondary" id="copySQLBtn">复制 ALTER SYSTEM SQL</button>
            <button @click="downloadConfig" class="btn-secondary">下载配置文件</button>
          </div>
        </div>
        <div class="params-container">
          <table class="params-table">
            <thead>
              <tr>
                <th>参数名</th>
                <th>参数值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(param, index) in generatedParams" :key="index">
                <td class="param-name">{{ param.name }}</td>
                <td class="param-value">
                  <input
                    type="text"
                    v-model="param.value"
                    class="param-input"
                    @blur="updateParam(index, $event.target.value)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { calculateParams } from './utils/paramCalculator'

export default {
  name: 'App',
  setup() {
    const config = reactive({
      dbVersion: '13',
      cpuCores: 8,
      memoryGB: 32,
      storageType: 'ssd'
    })

    const generatedParams = ref([])

    const generateConfig = () => {
      generatedParams.value = calculateParams(config)
    }

    const updateParam = (index, value) => {
      if (generatedParams.value[index]) {
        generatedParams.value[index].value = value
      }
    }

    const copyToClipboard = (event) => {
      const configText = generatedParams.value
        .map(param => `${param.name} = ${param.value}`)
        .join('\n')
      
      navigator.clipboard.writeText(configText).then(() => {
        // 使用更友好的提示方式
        if (event && event.target) {
          const btn = event.target
          const originalText = btn.textContent
          btn.textContent = '已复制！'
          btn.style.background = '#28a745'
          setTimeout(() => {
            btn.textContent = originalText
            btn.style.background = ''
          }, 2000)
        } else {
          alert('配置已复制到剪贴板！')
        }
      }).catch(err => {
        console.error('复制失败:', err)
        alert('复制失败，请手动复制')
      })
    }

    const copyAlterSystemSQL = (event) => {
      // 生成 ALTER SYSTEM SET 的 SQL 语句
      // 对于字符串值需要加引号，对于数字和布尔值不需要
      const escapeValue = (value) => {
        const str = String(value).trim()
        // 如果是 on/off/true/false，不需要引号
        if (str.toLowerCase() === 'on' || str.toLowerCase() === 'off' || 
            str.toLowerCase() === 'true' || str.toLowerCase() === 'false') {
          return str.toLowerCase()
        }
        // 如果是纯数字，不需要引号
        if (/^-?\d+$/.test(str)) {
          return str
        }
        // 其他情况需要加单引号，并转义单引号
        return `'${str.replace(/'/g, "''")}'`
      }

      const sqlStatements = generatedParams.value
        .map(param => `ALTER SYSTEM SET ${param.name} = ${escapeValue(param.value)};`)
        .join('\n')
      
      navigator.clipboard.writeText(sqlStatements).then(() => {
        if (event && event.target) {
          const btn = event.target
          const originalText = btn.textContent
          btn.textContent = '已复制！'
          btn.style.background = '#28a745'
          setTimeout(() => {
            btn.textContent = originalText
            btn.style.background = ''
          }, 2000)
        } else {
          alert('ALTER SYSTEM SQL 已复制到剪贴板！')
        }
      }).catch(err => {
        console.error('复制失败:', err)
        alert('复制失败，请手动复制')
      })
    }

    const downloadConfig = () => {
      const configText = generatedParams.value
        .map(param => `${param.name} = ${param.value}`)
        .join('\n')
      
      const blob = new Blob([configText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `postgresql-${config.dbVersion}-optimized.conf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    // 初始化时生成一次配置
    generateConfig()

    return {
      config,
      generatedParams,
      generateConfig,
      updateParam,
      copyToClipboard,
      copyAlterSystemSQL,
      downloadConfig
    }
  }
}
</script>

<style scoped>
.app-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  padding: 30px;
}

.input-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.input-section h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.generate-btn:active {
  transform: translateY(0);
}

.result-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.result-header h2 {
  color: #333;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.params-container {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
}

.params-table thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.params-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.params-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
}

.params-table tbody tr:hover {
  background: #f8f9fa;
}

.param-name {
  font-weight: 600;
  color: #495057;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  width: 40%;
}

.param-value {
  padding: 0;
}

.param-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #212529;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.param-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.param-input:hover {
  border-color: #ccc;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .input-section {
    position: static;
  }
}
</style>

