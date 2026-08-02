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

### 项目卡片设计（第二次扩展 — 2026-07-30）

项目展示区每个项目渲染为卡片，卡片包含：
- 项目名称
- 描述
- 技术栈标签
- **GitHub 源码链接**（指向独立仓库，`https://github.com/standby-time/<repo-name>`）
- **在线演示链接**（指向前端应用的 GitHub Pages，`https://standby-time.github.io/<repo-name>`）
  - 纯前端可部署项目：直接填入 demo 链接
  - 不可前端部署的项目（如命令行工具）：demo 链接可省略或替换为文档/截图链接

**卡片交互行为**：
- **点击卡片主体** → 跳转到该项目在本站内的专属详情页（`#projects/<project-id>`），展示项目的详细说明、截图、架构设计等
- **点击右上角「源码」链接** → 新标签页打开 GitHub 仓库（外部跳转，行为不变）
- **点击右上角「演示」链接** → 新标签页打开在线演示（外部跳转，行为不变）

卡片设计要点：
- 源码链接和演示链接用不同图标/颜色区分（如 GitHub 图标 vs 外部链接图标）
- 卡片整体有 hover 效果和 cursor:pointer，提示可点击进入详情
- 右上角链接按钮在事件冒泡中 `stopPropagation`，防止点击链接时同时触发卡片跳转
- 无演示链接的项目卡片优雅降级，不显示失效链接

### 项目数据结构（更新）

```js
const projects = [
  {
    id: 'proj-1',
    name: '',
    description: '',   // 卡片上的简短描述
    contentMd: '',     // 详情页正文（Markdown，类比博客文章的 contentMd）
    techStack: [],
    githubUrl: '',     // 独立项目仓库完整 URL（必填）
    demoUrl: '',       // 在线演示 URL（可选）
    category: '',
    deployed: false,   // 是否已部署，控制演示链接显隐
    featured: false,   // 是否精选项目（卡片上显示星标）
  }
];
```

项目详情页设计与博客详情页对齐：
- 复用博客详情页的布局结构（返回按钮、标题、元信息、正文）
- 正文使用 Markdown 编写，通过 `marked.js` 渲染
- 详情页顶部额外展示：技术栈标签、GitHub 链接、演示链接
- 支持截图/架构图等图片展示

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

## C语言刷题代码展示（第三次扩展 — 2026-07-31）

### 概述

将菜鸟教程 C 语言刷题代码（.c 文件）作为独立项目展示在网站上。页面布局为左侧题目目录 + 右侧连续展示每题的题目描述和代码，点击目录项平滑滚动到对应题目位置。

### 仓库组织

- **独立仓库 `c-practice-100-CaiNiao`**：存放所有 .c 文件
  - GitHub 地址：`https://github.com/standby-time/c-practice-100-CaiNiao`
  - .exe 文件通过 `.gitignore` 排除，不提交
  - 文件命名建议：`01-hello-world.c`、`02-add-two-numbers.c` 等，编号决定排序

- **主仓库展示**：项目卡片中新增"C语言刷题记录"，点击进入刷题展示页（`#projects/c-practice-100-CaiNiao`）

### .c 文件头部约定

每个 .c 文件必须包含以下格式的头部注释，供同步脚本解析：

```c
/*
题目：Hello World

思路：编写一个程序，输出 "Hello, World!"
*/

#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

- `题目：`：题目标题（必填，取第一句/第一行作为短标题显示在目录中）
- `思路：`：解题思路/题目描述（可选，显示在代码块上方）
- 头部注释后的所有内容视为代码块

### 数据同步方案

使用 Node.js 脚本在部署时自动同步。原理：读取独立仓库中的 .c 文件 → 解析头部注释 → 生成 JS 数据文件。

**同步脚本** `scripts/sync-c-practice.js`：

```js
// 扫描指定目录下所有 .c 文件，解析头部注释（题目：/ 思路：），生成 js/data-c-practice.js
// 用法：node scripts/sync-c-practice.js <c-practice-100-CaiNiao 仓库本地路径>
```

**本地开发时**：手动运行同步脚本（需安装 Node.js），或手动编辑 `js/data-c-practice.js`（不推荐）

**GitHub Actions 部署时**：在构建步骤中 clone 独立仓库并运行同步脚本，再部署

### 更新后的 GitHub Actions 工作流

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  # 也支持从独立仓库通过 repository_dispatch 触发
  repository_dispatch:
    types: [c-practice-100-CaiNiao-updated]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 同步 C 语言刷题数据
      - name: Sync C practice problems
        run: |
          git clone https://github.com/standby-time/c-practice-100-CaiNiao.git /tmp/c-practice-100-CaiNiao
          node scripts/sync-c-practice.js /tmp/c-practice-100-CaiNiao

      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 页面布局与交互

```
┌─────────────┬──────────────────────────────────────────────┐
│ 📚 题目列表  │  #1 Hello World                            │
│ 共 50 题     │  编写一个程序，输出 "Hello, World!"        │
│              │  ┌──────────────────────────────────────┐   │
│ #1 Hello     │  │ #include <stdio.h>                  │   │
│   World      │  │                                     │   │
│ #2 两数之和  │  │ int main() {                        │   │
│ #3 判断素数  │  │     printf("Hello, World!\n");      │   │
│ #4 斐波那契  │  │     return 0;                       │   │
│ #5 数组排序  │  │ }                                   │   │
│ ...          │  └──────────────────────────────────────┘   │
│              │                                             │
│              │  #2 两数之和                                │
│              │  输入两个整数，输出它们的和                 │
│              │  ┌──────────────────────────────────────┐   │
│              │  │ #include <stdio.h>                  │   │
│              │  │ ...                                │   │
│              │  └──────────────────────────────────────┘   │
└─────────────┴──────────────────────────────────────────────┘
```

**左侧目录栏**：
- 固定宽度 ~220px，独立滚动（`overflow-y: auto`）
- 顶部显示总题数统计
- 每项显示题号和标题，当前可视题目高亮（Intersection Observer 监听右侧内容区滚动）
- 点击目录项 → 右侧内容区 `scrollIntoView({ behavior: 'smooth' })` 到对应题目
- 目录项不需要 `stopPropagation`，因为这里没有外层点击事件

**右侧内容区**：
- 独立滚动（`overflow-y: auto`），占满剩余宽度
- 所有题目按题号顺序连续纵向排列
- 每道题包含：题号标题（`#1 Hello World`）、题目描述文字、代码块
- 代码块使用等宽字体、深色背景、语法高亮（基础 C 关键字高亮即可）、支持水平滚动
- 每道题之间有明显分隔

**交互细节**：
- 目录高亮跟随右侧滚动实时更新（Intersection Observer API）
- 滚动到某题时，对应目录项高亮（添加 `.active` 类）
- 目录和内容区各自独立滚动，互不阻塞

### 路由

- 项目卡片点击 → `#projects/c-practice-100-CaiNiao`，进入刷题展示页
- 返回按钮 → `#projects`，回到项目列表
- 左侧目录点击**不改变 URL**，仅触发内容区滚动

### 数据结构

```js
// js/data-c-practice.js（由同步脚本自动生成，不要手动编辑）
const cPracticeProblems = [
  {
    id: 1,                              // 题号（从文件名提取）
    title: 'Hello World',               // 题目标题（从 题目： 解析，取第一句）
    description: '编写一个程序...',      // 题目描述（从 思路： 解析）
    code: '#include <stdio.h>\n...',    // 代码内容（头部注释之后的所有行）
    fileName: '01-hello-world.c'        // 源文件名
  },
];
```

### 项目卡片配置

```js
// 在 data.js 的 projects 数组中新增
{
  id: 'c-practice-100-CaiNiao',
  name: 'C语言刷题记录',
  description: '菜鸟教程 C 语言编程题解合集，涵盖基础语法到算法应用',
  contentMd: '',                        // 不使用 Markdown 详情，由 render-c-practice.js 接管
  techStack: ['C', '算法'],
  githubUrl: 'https://github.com/standby-time/c-practice-100-CaiNiao',
  demoUrl: '',                          // 无在线演示
  category: 'learning',
  deployed: false,
  featured: false,
  customRenderer: 'c-practice-100-CaiNiao'          // 标记使用自定义渲染器，不走默认 Markdown 详情页
}
```

### 实现文件

| 文件 | 说明 |
|------|------|
| `scripts/sync-c-practice.js` | Node.js 同步脚本，扫描 .c 文件生成数据文件 |
| `js/data-c-practice.js` | 题目数据（脚本自动生成，不手动编辑） |
| `js/render-c-practice.js` | 刷题展示页渲染（目录 + 内容区 + 滚动联动） |
| `css/pages.css` | 新增 `.c-practice` 相关样式 |

### router.js 修改点

在项目详情路由分支中增加判断：如果 `project.customRenderer === 'c-practice-100-CaiNiao'`，调用 `CPracticeRenderer.render(container, project)` 而不是走默认的 Markdown 渲染。

### 独立仓库结构

```
c-practice-100-CaiNiao/
├── .gitignore            # 排除 *.exe
├── README.md             # 仓库说明
├── 01-hello-world.c
├── 01-hello-world.exe    # （gitignore，不提交）
├── 02-add-two-numbers.c
├── 03-check-prime.c
├── ...
└── 50-some-problem.c
```

`.gitignore` 内容：
```
*.exe
```

---

## 毕设项目展示（第四次扩展 — 2026-08-02）

### 概述

将毕业设计「脑力负荷追踪系统」作为独立项目展示在网站上。项目为 React Native 移动端应用 + Node.js 后端 + MySQL 数据库的完整系统，不可前端直接部署，详情页使用标准 Markdown 渲染。

### 仓库组织

- **独立仓库 `mental-effort-tracker`**：存放毕设完整源码
  - GitHub 地址：`https://github.com/standby-time/mental-effort-tracker`
  - 项目本地路径：`D:\GraduationProject`
  - 包结构：`MentalEffortTracker/`（React Native 前端） + `backend/`（Node.js 后端）
  - `.gitignore` 排除 `node_modules/`、`*.exe`、构建产物、日志文件

### 技术架构

```
┌──────────────────────────────┐     ┌──────────────────────────────┐
│   React Native App           │────▶│   Node.js Backend            │
│   (TypeScript)               │     │   (Express)                  │
│   - 实验任务调度             │     │   - RESTful API              │
│   - 数据采集与本地缓存       │     │   - MySQL 数据库操作         │
│   - 通知提醒 (Notifee)       │     │   - ngrok 内网穿透           │
│   - 数据上传与同步           │     │                              │
└──────────────────────────────┘     └──────────────┬───────────────┘
                                                    │
                                        ┌───────────▼───────────┐
                                        │   MySQL Database      │
                                        │   - 用户/实验/任务    │
                                        │   - N-Back 测评数据   │
                                        │   - 脑力负荷记录      │
                                        └───────────────────────┘
```

- **前端**：React Native 0.84.1，TypeScript，AsyncStorage 本地存储，Notifee 通知，react-native-get-random-values / uuid
- **后端**：Node.js + Express 5.x，mysql2 连接 MySQL，cors 跨域支持，ngrok 内网穿透
- **数据库**：MySQL，通过 ngrok TCP 隧道暴露给公网
- **启动方式**：一键 `start_project.bat` 脚本依次启动后端、ngrok 隧道、Metro 开发服务器

### 项目卡片配置

```js
// 在 data.js 的 PROJECTS 数组中新增
{
  id: "mental-effort-tracker",
  name: "脑力负荷追踪系统",
  category: "app",
  description: "毕业设计。基于 React Native 的移动端脑力负荷追踪工具，支持 N-Back 实验任务、数据采集与云端同步。",
  techStack: ["React Native", "TypeScript", "Node.js", "Express", "MySQL"],
  githubUrl: "https://github.com/standby-time/mental-effort-tracker",
  demoUrl: "",                          // 不可前端部署，无在线演示
  deployed: false,
  featured: true,
  contentMd: "...",                     // Markdown 详情正文
}
```

### 项目分类扩展

新增分类 `app`（移动端开发），需同步更新：

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | `PROJECT_CATEGORIES` 新增 `{ id: "app", label: "移动开发" }` |
| `js/data.js` | `SIDEBAR_CONFIG.projects.categories` 新增 `app` 分类项 |

现有分类变为：全部项目 / Web 开发 / 移动开发 / 算法 & 数据结构 / 工具 & 配置

### 详情页

毕设详情页走默认 Markdown 渲染流程（`contentMd` 字段），不需要 `customRenderer`。内容应包括：

- 项目背景与毕设选题说明
- 技术选型理由（为什么选 React Native / Node.js / MySQL）
- 系统架构图与模块说明
- 数据库 ER 图或表结构
- 实验设计（N-Back 任务流程）
- 安装与运行说明
- 项目总结与展望

### 与 C 刷题项目的区别

| 对比维度 | C语言刷题记录 | 脑力负荷追踪系统 |
|---------|-------------|---------------|
| 详情渲染 | 自定义渲染器（目录 + 代码滚动联动） | 标准 Markdown 渲染 |
| 数据来源 | 同步脚本解析 .c 文件 | Markdown 字符串（contentMd） |
| 项目性质 | 代码合集展示 | 毕设完整系统介绍 |
| 可部署 | 无前端演示 | 不可前端部署（需移动端 + 后端 + 数据库） |

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
3. **项目展示**：项目卡片（名称、描述、技术栈、GitHub/演示链接），点击卡片进入项目详情页；与 GitHub 独立仓库关联
4. **联系方式**：邮箱、GitHub、社交媒体链接等

### 路由设计

- 纯前端路由：使用 `hash`（`#about`、`#blog`、`#projects`、`#contact`）
- 欢迎页为默认路由（`#welcome` 或 `/`），进入主页后不再显示欢迎页
- 导航栏点击切换 hash，JS 监听 hash 变化渲染对应板块
- **子路由**（类比博客的 `#blog/<post-id>`）：
  - `#projects/<project-id>` → 项目详情页（独立视图，展示项目完整说明）
  - 返回：点击返回按钮或通过导航栏切换回项目列表

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
│       └── deploy.yml      # GitHub Actions 自动部署配置（含同步步骤）
├── index.html              # 入口文件（包含欢迎页和主页面框架）
├── CLAUDE.md               # 本文件
├── scripts/
│   └── sync-c-practice.js  # C 刷题数据同步脚本
├── css/
│   ├── reset.css           # CSS reset / normalize
│   ├── variables.css       # CSS 变量定义（主题色、字体、间距）
│   ├── layout.css          # 全局布局（顶部栏、导航、侧边栏、内容区）
│   ├── components.css      # 可复用组件样式（按钮、卡片、代码块、标签等）
│   └── pages.css           # 各页面/板块特有样式（含 .c-practice 样式）
├── js/
│   ├── app.js              # 主入口：路由、初始化、全局状态
│   ├── theme.js            # 主题切换逻辑
│   ├── router.js           # 前端路由（hash 监听、板块切换，含 c-practice-100-CaiNiao 分支）
│   ├── sidebar.js          # 侧边栏目录生成与折叠逻辑
│   ├── render-blog.js      # 博客列表/详情渲染
│   ├── render-projects.js  # 项目展示渲染（含卡片及 GitHub/演示链接）
│   ├── render-c-practice.js# 刷题展示页渲染（目录 + 内容区 + 滚动联动）
│   ├── data.js             # 静态数据（博客、项目、个人信息等）
│   └── data-c-practice.js  # 题目数据（sync-c-practice.js 自动生成，不手动编辑）
└── assets/
    └── images/             # 图片资源
```
