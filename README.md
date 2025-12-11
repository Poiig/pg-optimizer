# PostgreSQL 性能参数优化工具

一个基于 Vue 3 的 PostgreSQL 性能参数自动优化工具，根据服务器配置（CPU核心数、内存大小、存储类型）自动生成优化的 PostgreSQL 配置参数。

## 功能特性

- 🎯 根据服务器配置自动计算优化的 PostgreSQL 参数
- 📊 支持 PostgreSQL 13/14/15/16 版本
- 💾 支持 SSD 和机械硬盘两种存储类型
- 📋 一键复制配置到剪贴板
- 💾 导出配置文件
- 🎨 现代化的响应式 UI 设计

## 技术栈

- Vue 3 (Composition API)
- Vite
- 原生 CSS

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用方法

1. 选择 PostgreSQL 版本
2. 输入 CPU 核心数
3. 输入内存大小（GB）
4. 选择存储类型（SSD 或机械硬盘）
5. 点击"生成配置"按钮
6. 查看生成的参数配置
7. 可以复制配置或下载为配置文件

## 参数说明

工具会根据以下规则计算参数：

- **max_connections**: CPU核心数 × 200
- **shared_buffers**: 内存的 1/4
- **work_mem**: 根据内存自动计算
- **max_worker_processes**: CPU核心数 × 2
- **并行处理参数**: 根据 CPU 核心数自动优化
- **I/O 相关参数**: 根据存储类型（SSD/HDD）自动调整

更多参数计算逻辑请参考 `src/utils/paramCalculator.js`

## 许可证

MIT License


