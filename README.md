# mini-markdown-editor 迷你 markdown 编辑器 (Vue 3 版本)

基于 Vue 3 + CodeMirror 6 + Element Plus 的轻量级 Markdown 编辑器。

## 功能特性

- 实时预览
- 工具栏（标题、加粗、斜体、链接、图片、表格等）
- 本地存储保存
- 字数/行数统计
- 全屏模式
- 布局切换（编辑/预览/分屏）
- 语法高亮

## 技术栈

- Vue 3 (Composition API)
- CodeMirror 6
- Element Plus
- Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建

```bash
npm run build
```

## 项目结构

```
src/
├── components/
│   ├── Editor.vue        # 编辑器组件
│   ├── EditorWrapper.vue # 主容器
│   ├── Preview.vue       # 预览组件
│   ├── Status.vue        # 状态栏
│   └── Toolbar.vue       # 工具栏
├── store/
│   ├── editor.js         # 编辑器状态管理
│   └── toolbar.js        # 工具栏状态管理
├── styles/
│   └── reset.css
├── App.vue
├── main.js
└── index.js
```

## License

MIT
