# CLAUDE.md - Standby-Time 个人网站

## 项目概述

从零搭建一个计算机专业学生的个人品牌网站，用于记录学习心得、展示项目作品、分享开源工具。纯前端实现（HTML + CSS + JavaScript），在 VS Code 中开发。

**目标**：你不仅是拿到一个能跑的网站，更要理解每一块代码的职责和设计思路，具备后续独立迭代的能力。

---

## 技术约束

- **纯前端三件套**：HTML + CSS + JavaScript，不引入任何框架或构建工具
- **无后端依赖**：所有数据静态管理（博客内容、项目列表等用 JS 数据或 JSON 驱动）
- **开发环境**：VS Code，使用 Live Server 插件进行本地预览
- **部署**：GitHub Pages 自动部署（GitHub Actions），主仓库 + 独立项目仓库联动

---

## 部署架构（第一次扩展 — 2026-07-30）

### 仓库组织策略

采用**独立仓库 + 主仓库链接**的方式：

```
GitHub (github.com/standby-time)
├── standby-time.github.io     ← 主仓库（个人网站源码 + GitHub Pages 部署）
├── project-1                  ← 独立项目仓库（各自可部署 GitHub Pages）
├── project-2                  ← 独立项目仓库
└── ...
```

- **主仓库**（`standby-time.github.io`）：承载个人介绍、博客、项目列表，即本仓库的部署目标
- **独立项目仓库**：每个项目有自己的仓库，各自可独立部署到 GitHub Pages
- 主仓库中的项目卡片通过链接指向各项目的仓库和在线演示

### 主仓库部署

- **仓库名**：`standby-time.github.io`（GitHub Pages 要求，与用户名一致）
- **部署方式**：GitHub Actions 自动部署
  - 推送代码到 `main` 分支 → Actions 自动构建 → 部署到 `gh-pages` 分支或直接从 `main` 部署
  - 使用 GitHub 官方 `actions/upload-pages-artifact` + `actions/deploy-pages` Action
- **访问地址**：`https://standby-time.github.io`

### 项目仓库部署

- 每个项目仓库独立开启 GitHub Pages（Settings → Pages → 选择 `main` 分支或 `gh-pages` 分支 或 GitHub Actions）
- 项目仓库命名无限制（如 `my-tool`、`demo-app` 等）
- 访问地址：`https://standby-time.github.io/<repo-name>`

### 项目卡片设计

项目展示区每个项目渲染为卡片，卡片包含：
- 项目名称
- 描述
- 技术栈标签
- **GitHub 源码链接**（指向独立仓库，`https://github.com/standby-time/<repo-name>`）
- **在线演示链接**（指向前端应用的 GitHub Pages，`https://standby-time.github.io/<repo-name>`）
  - 纯前端可部署项目：直接填入 demo 链接
  - 不可前端部署的项目（如命令行工具）：demo 链接可省略或替换为文档/截图链接

卡片设计要点：
- 源码链接和演示链接用不同图标/颜色区分（如 GitHub 图标 vs 外部链接图标）
- 无演示链接的项目卡片优雅降级，不显示失效链接
- 链接全部 `target="_blank"` 新标签页打开

### 项目数据结构（更新）

```js
const projects = [
  {
    id: 'proj-1',
    name: '',
    description: '',
    techStack: [],
    githubUrl: '',    // 独立项目仓库完整 URL（必填）
    demoUrl: '',      // 在线演示 URL（可选，纯后端/CLI 项目可为空）
    category: '',
    deployed: false,  // 是否已部署，用于控制演示链接是否显示
  }
];
```

### GitHub Actions 工作流（主仓库）

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## 设计系统

### 配色方案

两种主题，通过 CSS 变量切换：

**深色主题（默认）**：
- 背景色：深灰调，类似 VS Code 暗色主题底色
- 前景/文字：浅灰白，保证对比度
- 强调色：低饱和度的蓝/青，用于链接、选中状态、代码关键字
- 边框/分割线：比背景略亮的灰色

**浅色主题**：
- 背景色：偏暖的白色或极浅灰
- 前景/文字：深灰
- 强调色：与深色主题同色系但稍深的蓝
- 其余元素保持与深色主题一致的间距和布局

主题切换按钮位于顶部细栏，点击即时切换，偏好存入 `localStorage` 持久化。

### 字体

- **正文字体**：系统默认字体栈（`system-ui, -apple-system, Segoe UI, Roboto, sans-serif` 等），不引入外部字体
- **代码字体**：`Cascadia Code`（Windows 首选，VS Code 默认等宽字体），降级为 `Consolas, monospace`
- **代码块样式**：深色背景、圆角、内边距、行号（可选）、语法高亮配色参考 VS Code Dark+ 主题

### 代码块设计

所有涉及代码展示的区域（行内代码和代码块）必须：
- 使用等宽代码字体
- 代码块有独立背景色，与正文明显区分
- 保留正确的缩进
- 支持水平滚动（长代码行不换行）

---

## 页面布局架构

### 整体结构（主页面，非欢迎页）

```
┌─────────────────────────────────────────────┐
│  顶部细栏（~5vh）：名字 | 搜索框 | GitHub链接 | 主题切换  │
├─────────────────────────────────────────────┤
│  导航栏：简介 | 学习心得 | 项目展示 | 联系方式          │
├────────────┬────────────────────────────────┤
│            │                                │
│  左侧目录栏  │        中间内容展示区              │
│  （可折叠）  │        （独立滚动）                │
│            │                                │
│            │                                │
└────────────┴────────────────────────────────┘
```

### 各区域详细说明

1. **顶部细栏（Top Bar）**
   - 高度约占视口 5%
   - 左侧：网站名称 / 你的名字（Standby-Time）
   - 右侧：日间/夜间模式切换按钮、搜索框（可后期实现搜索功能）、GitHub 仓库快捷访问图标
   - 通栏背景，与导航栏视觉区分

2. **导航栏（Nav Bar）**
   - 水平排列的大板块入口：个人介绍、学习心得、项目展示、联系方式
   - 当前活跃板块高亮
   - 点击切换中间内容区展示（SPA 模式，不刷新页面）

3. **左侧目录栏（Sidebar）**
   - 展示当前大板块下的子目录结构
   - 支持折叠/展开（手风琴或树形）
   - 固定宽度，独立于中间内容区
   - 目录项点击后中间内容区滚动到对应锚点（或切换内容）

4. **中间内容展示区（Main Content）**
   - **独立滚动**：左侧目录和中间内容各自有独立的滚动容器，互不影响
   - 承载实际内容：个人介绍文字、博客文章、项目卡片等
   - 宽度自适应，填满剩余空间

### 滚动行为

- 左侧目录栏和中间内容区**各自独立滚动**
- 页面整体不出现全局滚动条（body 高度固定为视口高度）
- 使用 `overflow: hidden` 在 body，各区域内部使用 `overflow-y: auto`

---

## 页面架构

### 欢迎页（Landing Page）

- 独立于主布局，进入网站时首先展示
- 全屏背景（初始为纯色/渐变，后期可替换为背景图）
- 居中显示欢迎语："欢迎来到Standby-Time的网站！"
- 打字机动画效果（CSS animation 实现，后期优化）
- 下方有进入网站的入口（按钮或自动跳转）
- 与主页面是**两个独立视图**，通过显示/隐藏切换

### 主页面板块

1. **个人介绍**：头像、简介、技能标签/进度条
2. **学习心得（博客）**：文章列表，按时间排列，支持分类/标签
3. **项目展示**：项目卡片（名称、描述、技术栈、GitHub 链接），与 GitHub 仓库关联
4. **联系方式**：邮箱、GitHub、社交媒体链接等

### 路由设计

- 纯前端路由：使用 `hash`（`#about`、`#blog`、`#projects`、`#contact`）或 `history.pushState`
- 欢迎页为默认路由（`#welcome` 或 `/`），进入主页后不再显示欢迎页
- 导航栏点击切换 hash，JS 监听 hash 变化渲染对应板块

---

## 命名约定

- **文件命名**：小写英文，单词间用连字符（`index.html`、`styles.css`、`app.js`、`blog-data.js`）
- **CSS 类名**：BEM 风格（`.top-bar`、`.top-bar__search`、`.nav__item--active`）
- **JS 变量/函数**：camelCase（`currentSection`、`renderProjectCards`）
- **JS 常量**：UPPER_SNAKE_CASE（`DEFAULT_THEME`、`SECTION_IDS`）
- **CSS 变量**：`--` 前缀，kebab-case（`--color-bg-primary`、`--font-code`）
- **HTML ID**：camelCase（`mainContent`、`sidebarNav`）
- **注释语言**：中文，代码/变量名/文件名用英文

---

## 代码规范

### 注释要求

每个文件顶部有文件职责说明；每个区块（布局区域、功能模块、复杂逻辑）前有单行注释说明该区块的作用；CSS 按区域分组并标注；JS 函数有功能说明和参数说明。

### HTML

- 语义化标签优先（`<header>`、`<nav>`、`<main>`、`<aside>`、`<section>`、`<article>`、`<footer>`）
- 结构清晰，缩进统一（2 空格）
- 无障碍基础：图片有 `alt`，表单有 `label`，ARIA 标签合理使用

### CSS

- 使用 CSS 自定义属性（变量）管理颜色和尺寸
- 主题切换通过切换 `data-theme` 属性配合 CSS 变量实现
- Flexbox / Grid 布局为主，避免 `position: absolute` 滥用
- 媒体查询后期追加移动端适配

### JavaScript

- ES6+ 语法
- 无全局变量污染（使用 IIFE 或模块模式包裹，或至少统一挂在一个命名空间对象下）
- 数据和视图分离：数据逻辑和 DOM 操作逻辑分开
- 事件委托优于给每个元素单独绑定事件
- 所有 DOM 操作封装为函数，不裸写

---

## 数据管理

初期使用 JS 对象/数组硬编码数据，结构预留为后期迁移到 JSON 文件：

```js
// 博客数据结构示例
const blogPosts = [
  {
    id: 'post-1',
    title: '',
    date: '',
    tags: [],
    summary: '',
    content: '', // 支持 HTML 或 Markdown 字符串
  }
];

// 项目数据结构示例
const projects = [
  {
    id: 'proj-1',
    name: '',
    description: '',
    techStack: [],
    githubUrl: '',
    demoUrl: '', // 可选
    category: '', // 对应左侧目录分类
  }
];
```

后期可从独立 JSON 文件 fetch 加载，实现数据和页面完全解耦。

---

## 开发原则

1. **渐进增强**：先做核心结构和功能，再追加动画和细节优化
2. **模块化思维**：每个板块的渲染逻辑独立为一个 JS 函数/模块
3. **每次改动后验证**：用 Live Server 预览，确认无明显布局错乱和 JS 报错
4. **Git 记录清晰**：每完成一个独立功能提交一次，commit message 用中文描述做了什么
5. **扩展友好**：新增板块只需：添加 HTML 容器 + 写渲染函数 + 注册导航项 + 添加到路由映射

---

## 后期扩展预留

- 移动端响应式适配（媒体查询）
- 欢迎页背景图、粒子效果等视觉增强
- 打字机动画完善
- 搜索功能实际实现（前端全文搜索）
- 博客文章支持 Markdown 渲染
- 评论区（可接入 GitHub Discussions 等第三方）
- 项目数据通过 GitHub API 自动拉取仓库信息并同步卡片内容
- 部署到 Vercel / Cloudflare Pages 等其他平台（备案/国内访问等场景）

---

## 文件结构（初步约定）

```
my-website/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 自动部署配置
├── index.html              # 入口文件（包含欢迎页和主页面框架）
├── CLAUDE.md               # 本文件
├── css/
│   ├── reset.css           # CSS reset / normalize
│   ├── variables.css       # CSS 变量定义（主题色、字体、间距）
│   ├── layout.css          # 全局布局（顶部栏、导航、侧边栏、内容区）
│   ├── components.css      # 可复用组件样式（按钮、卡片、代码块、标签等）
│   └── pages.css           # 各页面/板块特有样式
├── js/
│   ├── app.js              # 主入口：路由、初始化、全局状态
│   ├── theme.js            # 主题切换逻辑
│   ├── router.js           # 前端路由（hash 监听、板块切换）
│   ├── sidebar.js          # 侧边栏目录生成与折叠逻辑
│   ├── render-blog.js      # 博客列表/详情渲染
│   ├── render-projects.js  # 项目展示渲染（含卡片及 GitHub/演示链接）
│   └── data.js             # 静态数据（博客、项目、个人信息等）
└── assets/
    └── images/             # 图片资源
```
