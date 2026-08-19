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

### 页面布局与交互（第五次扩展 — 2026-08-03 更新）

进入刷题详情页时，主侧边栏（项目分类目录）保持可见，不隐藏。刷题页内部的题目列表作为内容区内的子侧边栏，与主侧边栏并存。

```
┌──────────┬──────────┬──────────────────────────────────────┐
│ 项目分类   │ 📚 题目列表│  #1 Hello World                     │
│ (主侧边栏) │ 共 50 题  │  编写一个程序，输出 "Hello, World!" │
│          │           │  ┌──────────────────────────────┐   │
│ 全部项目   │ #1 Hello  │  │ #include <stdio.h>          │   │
│ Web 开发  │   World   │  │                             │   │
│ 移动开发   │ #2 两数之和│  │ int main() {               │   │
│ 算法 &    │ #3 判断素数│  │     printf(...);           │   │
│   数据结构 │ #4 斐波那契│  │     return 0;              │   │
│ 工具 &    │ #5 数组排序│  │ }                           │   │
│   配置    │ ...       │  └──────────────────────────────┘   │
│          │           │                                     │
│          │           │  #2 两数之和                         │
│          │           │  输入两个整数，输出它们的和           │
│          │           │  ┌──────────────────────────────┐   │
│          │           │  │ #include <stdio.h>          │   │
│          │           │  │ ...                         │   │
│          │           │  └──────────────────────────────┘   │
└──────────┴──────────┴──────────────────────────────────────┘
```

**主侧边栏（项目分类目录）**：
- 进入刷题详情页后保持可见，不隐藏
- 可正常折叠/展开、点击分类筛选跳回项目列表

**题目列表侧边栏（内容区内）**：
- 固定宽度 ~220px，独立滚动（`overflow-y: auto`）
- 顶部显示总题数统计
- 每项显示题号和标题，当前可视题目高亮（Intersection Observer 监听右侧内容区滚动）
- 点击目录项 → 右侧内容区 `scrollIntoView({ behavior: 'smooth' })` 到对应题目

**题目内容区**：
- 独立滚动（`overflow-y: auto`），占满剩余宽度
- 所有题目按题号顺序连续纵向排列
- 每道题包含：题号标题（`#1 Hello World`）、题目描述文字、代码块
- 代码块使用等宽字体、深色背景、语法高亮（基础 C 关键字高亮即可）、支持水平滚动
- 每道题之间有明显分隔

**交互细节**：
- 目录高亮跟随右侧滚动实时更新（Intersection Observer API）
- 滚动到某题时，对应目录项高亮（添加 `.active` 类）
- 三个区域（主侧边栏、题目目录、题目内容）各自独立滚动，互不阻塞

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

## 学习资源模块（第五次扩展 — 2026-08-03 重新设计）

### 概述

将原"工具箱"模块重构为"学习资源"，聚焦于学习资料和在线教程的分类整理。原模块中电子书链接为无效占位链接，本次补充了机器学习、计算机系统等方向的真实资源链接。

### 模块命名

- 导航栏标签：`学习资源`（原 `工具箱`）
- 路由 hash：保留 `#toolbox`（不影响现有链接和书签）
- 图标：📚（原 🧰）

### 数据分类

| 分类 ID | 分类名 | 说明 |
|---------|--------|------|
| `ml` | 机器学习 | 吴恩达课程、南瓜书、莫烦教程等 ML 学习资料 |
| `cs-systems` | 计算机系统 | CSAPP、CMU 15-213、计算机系统要素等系统级课程 |
| `tutorials` | 教程网站 | 菜鸟教程、MDN、Hello 算法、CS 自学指南 |
| `tools` | 开发工具 | JSON 解析、正则测试、Carbon 代码截图、Excalidraw |
| `daily-tools` | 实用工具 | 腾讯帮小忙、工具 123、MikuTools 等在线工具箱（第十四次扩展新增） |
| `design` | 设计素材 | 优品 PPT、Pixabay、macOS 图标等素材资源（第十四次扩展新增） |
| `community` | 技术社区 | SegmentFault、IT 之家、小众技术工具库（第十四次扩展新增） |
| `learning` | 学习资料 | 英语真题、答案吧、历史时间轴、wikiHow（第十四次扩展新增） |

### 机器学习资源

| 名称 | 链接 | 说明 |
|------|------|------|
| 吴恩达机器学习公开课 | `https://www.coursera.org/learn/machine-learning` | Coursera 经典 ML 入门课程 |
| 斯坦福ML中文笔记 | `https://github.com/fengdu78/Coursera-ML-AndrewNg-Notes` | 吴恩达课程中文字幕与笔记 |
| 莫烦Python机器学习 | `https://github.com/MorvanZhou/tutorials` | 中文 ML 实战教程代码 |
| 南瓜书 | `https://github.com/datawhalechina/pumpkin-book` | 《机器学习》（西瓜书）公式详解 |

### 计算机系统资源

| 名称 | 链接 | 说明 |
|------|------|------|
| CSAPP 官方主页 | `https://csapp.cs.cmu.edu/` | 《深入理解计算机系统》官网与实验 |
| CSAPP 豆瓣 | `https://book.douban.com/subject/27000879/` | 书籍介绍与读者评价 |
| CMU 15-213 课程 | `https://www.cs.cmu.edu/~213/` | CMU 计算机系统导论课程主页 |
| 计算机系统要素 | `https://book.douban.com/subject/1998341/` | 《The Elements of Computing Systems》豆瓣页 |

### 数据结构

```js
const LEARNING_RESOURCES = {
  ml: [
    { name: '', url: '', desc: '' },
  ],
  'cs-systems': [
    { name: '', url: '', desc: '' },
  ],
  tutorials: [
    { name: '', url: '', desc: '' },
  ],
  tools: [
    { name: '', url: '', desc: '' },
  ],
  'daily-tools': [ /* 实用工具 */ ],
  design: [ /* 设计素材 */ ],
  community: [ /* 技术社区 */ ],
  learning: [ /* 学习资料 */ ],
};
```

数据变量名从 `TOOLBOX_DATA` 改为 `LEARNING_RESOURCES`，结构从 `{ tools, websites, ebooks }` 改为 `{ ml, 'cs-systems', tutorials, tools }`，第十四次扩展新增 `'daily-tools'` / `design` / `community` / `learning` 四个分类。

### 新增资源（第十四次扩展 — 2026-08-17）

**开发工具**（`tools` 追加）：Tools.Fun（开发者工具箱）、NameBeta（域名查询取名）、Twikoo（博客评论系统）。

**实用工具**（`daily-tools`）：

| 名称 | 链接 | 说明 |
|------|------|------|
| 腾讯帮小忙工具箱 | `https://tool.browser.qq.com/` | 腾讯官方在线工具箱，图片/PDF/文档/开发工具 |
| 工具 123 | `http://www.gjw123.com/` | 在线工具导航聚合站，上千个免安装小工具 |
| MikuTools | `https://tools.miku.ac/` | 轻量在线工具集合 |
| 打字打字 | `https://dazidazi.com/` | 在线打字练习，指法纠正与闯关 |
| ParseVideo 视频下载 | `https://pv.vlogdownloader.com/` | 在线视频解析下载，支持多平台 |

**设计素材**（`design`）：

| 名称 | 链接 | 说明 |
|------|------|------|
| 优品 PPT | `https://www.ypppt.com/` | 免费 PPT 模板下载 |
| Pixabay | `https://pixabay.com/zh/` | 免费商用图片、插画与视频素材 |
| macOS Icons | `https://macosicons.com/zh#/` | macOS 风格应用图标 |
| 相机水印生成器 | `https://www.immers.icu/` | 徕卡、哈苏等品牌相机水印模板 |

**技术社区**（`community`）：

| 名称 | 链接 | 说明 |
|------|------|------|
| SegmentFault 思否 | `https://segmentfault.com/` | 中文技术问答社区 |
| IT 之家 | `https://www.ithome.com/` | 科技资讯媒体 |
| 小众技术工具库 | `https://www.xiaozhongjishu.com/sites/113.html` | 实用软件与精品网站导航 |

**学习资料**（`learning`）：

| 名称 | 链接 | 说明 |
|------|------|------|
| 英语真题在线 | `https://zhenti.burningvocabulary.cn/` | 考研、四六级、专四专八历年真题 |
| 答案吧 | `http://www.daanbar.com/index.html` | 大学课后习题答案与解析 |
| 中国历史时间轴 | `https://www.lishiju.net/timeline.html` | 朝代更迭可视化时间线 |
| wikiHow 中文 | `https://zh.wikihow.com/` | 生活百科指南 |

### 新增资源（第十五次扩展 — 2026-08-18）

**教程网站**（`tutorials` 追加）：W3School 中文（Web 开发中文教程）、Hexo 文档（静态博客框架官方文档）。

**实用工具**（`daily-tools` 追加）：

| 名称 | 链接 | 说明 |
|------|------|------|
| FakeUpdate | `https://fakeupdate.net/` | 模拟系统更新界面的整蛊网站 |
| 土味情话生成器 | `https://lovelive.tools/` | 随机语录生成 API（域名与 Love Live 无关） |
| Listen 1 | `https://listen1.github.io/listen1/` | 聚合多平台音乐搜索与播放的开源播放器 |
| EmojiAll | `https://www.emojiall.com/zh-hans` | Emoji 表情大全与百科 |

**设计素材**（`design` 追加）：WebGradients（渐变配色参考，一键复制 CSS）。

**技术社区**（`community` 追加）：A 姐分享（软件、教程与实用网站资源分享）；「小众技术工具库」条目 URL 由 `sites/113.html` 更新为站点主页。

**学习资料**（`learning` 追加）：

| 名称 | 链接 | 说明 |
|------|------|------|
| 宇宙尺度 2 | `https://htwins.net/scale2/` | 从普朗克长度到可观测宇宙的互动缩放科普 |
| 10 万颗恒星 | `http://stars.chromeexperiments.com/` | 银河系 3D 可视化漫游 |

**去重记录**：MDN Web Docs 与第十四次扩展已有条目 URL 完全一致，未重复添加。

### 新增资源（第十六次扩展 — 2026-08-19）

**教程网站**（`tutorials` 追加）：

| 名称 | 链接 | 说明 |
|------|------|------|
| Jekyll 官网 | `https://jekyllrb.com/` | Jekyll 静态博客框架官网，支持 GitHub Pages 免费托管 |
| My-Notes 学习笔记 | `https://mrjokersince1997.github.io/My-Notes/#/` | 个人技术学习笔记站点 |
| Bootstrap 中文网 | `https://www.bootcss.com/` | Bootstrap 中文官方文档 |
| TypeScript 中文手册 | `https://typescript.bootcss.com/` | TypeScript 官方手册中文版 |
| Docker 教程（EasyDoc） | `https://docker.easydoc.net/doc/81170005/cCewZWoN/lTKfePfP` | Docker 从入门到实践教程 |
| Unity 中文官网 | `https://unity.cn/` | Unity 中国官方站点，引擎下载与学习社区 |

**开发工具**（`tools` 追加）：GetMan 接口调试（`https://getman.cn/`，在线接口调试与 Mock 数据生成）。

**设计素材**（`design` 追加）：The Noun Project（`https://thenounproject.com/`，矢量图标素材库）；中国色（`https://zhongguose.com/`，中国传统颜色参考）。

**技术社区**（`community` 追加）：软仓（`https://www.ruancang.net/`，软件资源搜索导航站）。

### 渲染页面

- 页面标题：`学习资源`
- 副标题描述：更新为学习资料和工具说明
- 每个分类渲染为独立的 `<section>`，带 id 锚点（如 `section-res-ml`），支持侧边栏锚点跳转
- 每个资源项渲染为链接卡片（复用 `.toolbox-card` 样式）

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | `NAV_SECTIONS` 标签改为"学习资源"、图标改为 📚；`TOOLBOX_DATA` → `LEARNING_RESOURCES`，重新组织数据结构；`SIDEBAR_CONFIG.toolbox` 更新 title 和 categories |
| `js/render-content.js` | `_renderToolbox()` 改为引用新数据结构，更新标题和描述文字 |
| `css/pages.css` | 检查 `.toolbox-card` 等样式是否需要调整 |

### 路由

- hash 保留 `#toolbox`，不影响现有书签和链接
- 侧边栏目录项点击 → `scrollIntoView` 滚动到对应分类 section

---

## 首页 — 每日一句卡片（第六次扩展 — 2026-08-05）

### 功能需求
在首页 Hero 区域下方展示一个「每日一句」卡片，用于展示励志语录、技术格言或学习感悟。

### 交互效果
- **打字机效果**：卡片加载时，文字以逐个字符出现的方式显示（模拟打字机），速度 60ms/字符
- **每日轮换**：基于日期哈希确定当天句子，同一天内不变
- **光标动画**：打字过程中显示闪烁的光标 `|`，打完后移除光标并淡入作者署名

### 数据来源
- 内置 20 条句子库（`DAILY_QUOTES` 数组），包含技术名言和个人感悟
- `getDailyQuote()` 函数根据日期字符串哈希取模，确保同一天同一句

### 设计风格
- 卡片风格与现有项目卡片一致（`var(--color-bg-card)` 背景 + 边框 + 阴影）
- 浅色/深色主题自适应（使用 CSS 变量）
- 左侧大引号装饰（`"`），35% 透明度强调色
- 句子文字 1.05rem，行高 1.8
- 作者署名在句子下方右对齐，打字完成后淡入

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | 新增 `DAILY_QUOTES` 数组和 `getDailyQuote()` 函数 |
| `js/render-content.js` | `_renderAbout()` 新增每日一句卡片 HTML 占位 |
| `js/render-content.js` | 新增 `_animateDailyQuote()` 方法（打字机逻辑） |
| `css/pages.css` | 新增 `.daily-quote-card` 相关样式 |

### 设计决策
- 放在 Hero 区之后、技术栈之前，作为首页的第二内容区块
- 首页无侧边栏，内容自然顺序排列，每日一句卡片夹在 Hero 和技术栈之间
- 不使用外部 API，内置句子库保证离线可用和加载速度

---

## 关于模块（第七次扩展 — 2026-08-08）

### 概述

将原「联系方式」模块重构为「关于」模块，同时将首页的教育经历部分迁移至此，使首页更精简、关于模块信息更完整。

### 模块命名

- 导航栏标签：`关于`（原 `联系方式`）
- 路由 hash：保留 `#contact`（不影响现有链接和书签）
- 图标：👤（原 📬）

### 侧边栏目录

```
关于我 ▸
  └ 教育经历
联系方式
```

- 「关于我」为可折叠分类，「教育经历」为子项，点击锚点跳转到教育经历 section
- 「联系方式」为独立分类，点击锚点跳转到联系方式 section

### 首页变更

- 移除教育经历 section（`#section-education`），首页仅保留 Hero、每日一句、技术栈
- ABOUT_DATA 中的 `education` 字段移至关于模块渲染逻辑中直接引用

### 关于模块内容结构

1. **关于我** — 个人简介区（`#section-about-me`），简短自我介绍
2. **教育经历** — 从首页迁移（`#section-education`），学校、专业、时间、核心课程
3. **联系方式** — 原联系方式内容（`#section-contact-info`），邮箱、GitHub 等

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | `NAV_SECTIONS` 标签改为「关于」、图标改为 👤；`SIDEBAR_CONFIG` 新增 `contact` 配置 |
| `js/render-content.js` | `_renderAbout()` 移除教育经历渲染；`_renderContact()` 重写为关于页（关于我 + 教育经历 + 联系方式） |
| `index.html` | 导航栏标签和图标更新 |
| `css/pages.css` | 新增关于模块相关样式（`.about-section` 等） |

### 路由

- hash 保留 `#contact`，不影响现有书签和链接
- 侧边栏目录项点击 → `scrollIntoView` 滚动到对应 section

---

## 首页 Hero 重设计（第八次扩展 — 2026-08-08）

### 概述

重新设计首页 Hero 区域，移除每日一句卡片和技术栈区块，采用居中双栏布局（左文字 + 右 3D 倾斜头像），使首页更简洁聚焦。

### 布局结构

```
┌──────────────────────────────────────────────┐
│                页面全宽                        │
│     ┌─────────────────────────────┐          │
│     │      内容区（50% 宽度）       │          │
│     │                             │          │
│     │  Hi, I'm Standby-Time       │          │
│     │  A learner|       ┌────────┐│          │
│     │  (打字机循环)      │  头像   ││          │
│     │                   │ (3D倾斜) ││          │
│     │                   └────────┘│          │
│     └─────────────────────────────┘          │
└──────────────────────────────────────────────┘
```

- 内容区 `max-width: 50%`，`margin: 0 auto` 居中
- 内部 flex 双栏：左侧文字左对齐 + 右侧头像
- 第一行："Hi, I'm Standby-Time"（静态，Arial bold，名字 800 字重）
- 第二行：打字机循环 "A learner" / "An explorer"（Comic Sans MS）

### 字体与颜色

| 元素 | 字体 | 深色主题 | 浅色主题 |
|------|------|---------|---------|
| "Hi, I'm" | Arial, sans-serif, bold | #d4d4d4 | #333333 |
| "Standby-Time" | Arial, sans-serif, 800 | #e0e0e0 | #1a1a1a |
| 打字机角色 | Comic Sans MS, cursive | #888888 | #777777 |
| 光标 `|` | 继承 | --color-accent | --color-accent |

### 打字机循环

状态机：`typing(60ms/字) → holding(1.6s) → deleting(35ms/字) → gap(0.4s) → 下一个角色`

- 递归 `setTimeout` 实现，与项目既有模式一致
- 光标通过 `::after` 伪元素 + `hero-caret` 动画实现，不被 JS textContent 覆盖

### 3D 倾斜交互

- 鼠标在 Hero 区移动 → 头像 `rotateX/rotateY` 跟随，动态阴影反向偏移，高光跟随
- JS 写入 CSS 变量 `--tilt-x` / `--tilt-y` 到 `.home-hero__visual` 包装层
- `perspective(600px)` + 最大 ±12deg 倾斜
- 跟踪中 `transition: 0.12s linear`，离开后 `0.6s cubic-bezier` 平滑回正
- 触屏设备（`hover: none`）和 `prefers-reduced-motion` 跳过倾斜

### 移除内容

- 每日一句卡片（第六次扩展数据：`DAILY_QUOTES`、`getDailyQuote()`、`_animateDailyQuote()`、`.daily-quote-card*`、三极行楷 `@font-face`）
- 技术栈区块（`ABOUT_DATA.skills`、`ABOUT_DATA.title`、`.skill-tags*`）
- 旧 Hero 布局样式（`.home-hero` 等全部重写）

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | 删 `DAILY_QUOTES`/`getDailyQuote()`/`ABOUT_DATA.skills`/`ABOUT_DATA.title`；新增 `HERO_ROLES` |
| `js/render-content.js` | 重写 `_renderAbout()`；删 `_animateDailyQuote()`；新增 `_animateHeroRoles()`/`_bindHeroTilt()`/`_cleanupHomeHero()`/`_handleAvatarError()` |
| `css/pages.css` | 删旧 Hero/每日一句/技术栈样式；新增居中 Hero/打字机光标/3D 倾斜/响应式样式 |
| `index.html` | 无需改动 |

### 边界处理

- 头像加载失败 → `error` 事件降级显示名字首字母
- 路由切换 → `_cleanupHomeHero()` 清理定时器 + 事件监听
- `HERO_ROLES` 为空 → 打字机安全返回，行保持空白
- 窄屏（≤768px）→ 单列布局（文字上、头像下）

---

## GitHub 贡献热力图（第九次扩展 — 2026-08-08，持续迭代至 2026-08-09）

### 概述

在首页 Hero 区下方新增 GitHub 风格贡献热力图，展示当天前一年的贡献数据（7 行 × ~53 列）。数据通过构建时同步脚本获取，以卡片形式展示。

### 卡片设计（2026-08-09 终版）

- 复用 `.card` 基类（边框、圆角 8px、内边距 24px），覆盖背景和阴影
- `max-width: 840px` 居中，确保 53 周格子完整展示无滚动条
- 卡片背景 = 页面背景（`--color-bg-primary`），非 `--color-bg-card`
- 外圈阴影：默认 `0 0 14px rgba(0,0,0,0.45)`（深），hover `0 0 6px rgba(0,0,0,0.15)`（浅）
  - 浅色主题：默认 `0 0 14px rgba(0,0,0,0.1)`，hover `0 0 6px rgba(0,0,0,0.04)`
- 每个格子 12px × 12px，间距 2px，`border: 0.5px solid` 对应等级边框色
- 桌面端无横向滚动条；移动端（≤768px）`overflow-x: auto` 降级
- 标题：`Standby-Time过去一年 N 次贡献`（数字绿色加粗）
- 底部颜色图例：`少` / 5 色方块（带边框） / `多`，右对齐
- `--shadow-card` 统一为 `0 1px 4px`（`variables.css`），后续所有卡片遵循此标准

### 颜色

- 格子直接使用 GitHub API 返回的 `color` 字段作为内联背景色，与 GitHub 展示完全一致
- 同时设置 `data-level` 属性（0-4，基于 API 颜色映射），CSS 变量提供边框色和降级背景色
- 浅色主题 level 1 颜色为 `#aceebb`（GitHub 新色值），深色主题为 `#0e4429`
- 颜色图例方块通过 CSS `data-level` 选择器应用背景色与边框，无内联样式（支持主题切换）

### 贡献颜色变量（`--gh-bg-N` / `--gh-border-N`）

| 等级 | 深色 bg | 深色 border | 浅色 bg | 浅色 border |
|------|---------|------------|---------|------------|
| 0 | #161b22 | rgba(240,246,252,0.1) | #ebedf0 | rgba(27,31,35,0.06) |
| 1 | #0e4429 | rgba(240,246,252,0.1) | #aceebb | rgba(27,31,35,0.06) |
| 2 | #006d32 | rgba(240,246,252,0.1) | #40c463 | rgba(27,31,35,0.06) |
| 3 | #26a641 | rgba(240,246,252,0.1) | #30a14e | rgba(27,31,35,0.06) |
| 4 | #39d353 | rgba(240,246,252,0.1) | #216e39 | rgba(27,31,35,0.06) |

### 月份标签对齐

- 星期标签列固定 `width: 24px`，`flex-shrink: 0`
- 月份标签容器 `width = 网格宽度`（`weeks.length × 14 - 2`），`margin-left: 32px`
- 前 N−1 个月：`width: 跨周数 × 14px`；最后一个月：`flex: 1; min-width: 跨周数 × 14px`，拉伸至网格右边界
- 效果：最左月份标签对齐网格左边界，最右月份标签对齐网格右边界

### 数据流程

```
GitHub GraphQL API
      ↓ (部署时 fetch)
sync-github-contributions.js
      ↓ (生成）
js/data-github-contributions.js  ← 不提交（.gitignore）
      ↓ (动态 <script> 加载）
render-content.js → 首页渲染
```

### 同步脚本

`scripts/sync-github-contributions.js`：
- Node.js 脚本，调用 GitHub GraphQL API 查询 `user.contributionsCollection.contributionCalendar`
- 需要环境变量 `GH_TOKEN` 或 `GITHUB_TOKEN`
- 生成 `js/data-github-contributions.js`，数据格式：`{ totalContributions, weeks: [{ days: [{ date, count, color }] }] }`
- 本地开发时无 token 则跳过（exit 0），部署时 CI 注入 `${{ secrets.GITHUB_TOKEN }}`

### 渲染

- `_appendGitHubContributions(container)` — 动态创建 `<script>` 加载数据文件，onload 调用渲染，onerror 静默跳过
- `_renderGitHubContributions(container, data)` — 构建 7行×N列网格，含月份标签、周标签、总数统计、"少/多"颜色图例
- 每个格子使用 API 返回的 `color` 作为内联 `background-color`，同时通过 `getLevel(color)` 设置 `data-level` 控制边框色
- `getLevel(color)` 映射表覆盖新旧 GitHub 色值（含 `#aceebb` → level 1）
- 数据文件不存在时静默降级，首页仅显示 Hero
- 若已加载过（切换页面后回到首页），直接渲染，不重复加载脚本

### 颜色等级（基于 GitHub API 的 color 字段映射为 level）

| 等级 | API 浅色色值 | API 深色色值 |
|------|------------|------------|
| 0 | #ebedf0 | #161b22 |
| 1 | #aceebb / #9be9a8 | #0e4429 |
| 2 | #40c463 | #006d32 |
| 3 | #30a14e | #26a641 |
| 4 | #216e39 | #39d353 |

- 格子内联颜色直接使用 API `color`（即 GitHub 官方渲染色），CSS 变量色用于图例和主题切换降级
- Level 1 浅色值 `#aceebb` 为 GitHub 新色值，旧值 `#9be9a8` 也在映射表中兼容

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `scripts/sync-github-contributions.js` | 新增：GraphQL 数据同步脚本（默认无参数，以当天所在周为最后一周） |
| `.github/workflows/deploy.yml` | 新增同步步骤（C 刷题同步之前） |
| `.gitignore` | 新增 `js/data-github-contributions.js` |
| `js/render-content.js` | 新增 `_appendGitHubContributions()` / `_renderGitHubContributions()` + `getLevel()`；`_renderAbout()` 中调用 |
| `css/pages.css` | 新增 `.github-contributions` 卡片样式 + 颜色图例 + 双主题阴影 + 响应式 |
| `css/variables.css` | `--shadow-card` 减至 `0 1px 4px`（双主题），统一卡片阴影标准 |

### 路由

- 仅首页（`#about`）展示，无路由变更

---

## 首页时间段问候卡片（第十次扩展 — 2026-08-12）

### 概述

在首页 Hero 区下方、GitHub 贡献卡片上方显示一条根据当前时间段变化的问候语卡片，卡片样式与 GitHub 贡献卡片一致（同宽居中、双层阴影、双主题适配）。

### 数据

```js
const GREETINGS = [
  [0, 5, "夜深了，注意休息 🌙"],
  [5, 7, "早安，新的一天开始啦 🌅"],
  // ... 共 10 个时间段
];
function getGreeting() { ... } // 按 new Date().getHours() 匹配
```

### 渲染顺序（关键约束）

DOM 顺序必须为：Hero（`#section-profile`）→ 问候卡片（`#section-greeting`）→ GitHub 贡献卡片。

实现方式：两个卡片均用 `insertAdjacentHTML("afterend")` 锚定插入：
- `_renderGreetingCard()` — 插在 `#section-profile` 之后
- `_renderGitHubContributions()` — 优先插在 `#section-greeting` 之后，找不到则退回 `#section-profile` 之后

**注意**：不能用 `appendChild`，因为 GitHub 数据异步加载，后插入会打乱顺序（曾出现过问候卡片被挤到下方的 bug）。

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/data.js` | 新增 `GREETINGS` 数组 + `getGreeting()` 函数 |
| `js/render-content.js` | 新增 `_renderGreetingCard()`；`_renderGitHubContributions()` 插入锚点改为问候卡片优先 |
| `css/pages.css` | 新增 `.greeting-card` 样式（对齐 GitHub 贡献卡片阴影方案） |

---

## 页脚（第十一次扩展 — 2026-08-13）

### 概述

主页面底部新增**覆盖式页脚**：左侧版权文字 `© 2026 Standby-Time`（年份由 JS 动态生成），右侧链接图标（GitHub SVG 图标，新标签页打开）。页脚默认隐藏，内容区滚动到底端时才淡入显示。

### 显隐机制（关键约束）

- `.footer` 为 `position: absolute` 覆盖在 `.main-page` 底部（`.main-page` 需 `position: relative`），**不占布局空间**
- 默认 `opacity: 0; visibility: hidden; pointer-events: none`，滚动到底端时 JS 添加 `.footer--visible` 淡入
- 监听 `#mainContent` 的 `scroll` 事件：`scrollTop + clientHeight >= scrollHeight - 8` 时显示
- 路由切换后内容高度变化，用 `hashchange` + `requestAnimationFrame` 在渲染完成后重新判断
- 高度 `--footer-height: 32px`，与内容区底部 padding（`--space-xl`）对齐，显示时不遮挡内容

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `index.html` | `.main-area` 之后新增 `<footer class="footer">`（版权 + GitHub 图标链接） |
| `css/layout.css` | 新增 `.footer` / `.footer--visible` 样式；`.main-page` 加 `position: relative`（章节号顺延调整） |
| `css/variables.css` | 新增 `--footer-height: 32px` |
| `js/app.js` | `_onReady()` 中动态设置 `#footerYear`；`_bindGlobalEvents()` 中绑定滚动显隐逻辑 |

---

## 首页网格背景（第十二次扩展 — 2026-08-16）

### 概述

首页内容区背后绘制细网格背景：从页面左上角向中间径向渐隐，鼠标附近网格线产生透镜放大变形（顶点沿远离鼠标方向外推）。

### 渲染原理（Canvas）

- 每帧重绘全部网格线（间距 40px、线宽 1px），顶点按距鼠标距离变形
- 变形函数：距鼠标 `radius`(110px) 内的顶点外推 `push = strength * radius * t²`（t = 1 - d/radius），最大位移 ~44px，形成放大效果
- 渐隐遮罩：CSS `mask-image` 椭圆径向渐变（`ellipse 70% 70% at 0% 0%`，stops `#000 30% → transparent 100%`），网格从左上角向其他角方向覆盖 70%（横 70% 宽 / 纵 70% 高），30% 处开始变浅、边界完全透明。由浏览器合成器处理，Canvas 只管画线
- 鼠标平滑跟踪（每帧 lerp 0.15 + 接近目标时吸附），透镜有拖尾感
- 鼠标远离且网格已静止时跳过重绘（`staticDrawn` 标记），节省 CPU
- `prefers-reduced-motion` 时只画静态网格，不启动动画循环
- 线条颜色跟随主题：CSS 变量 `--grid-line-rgb` / `--grid-line-alpha`，MutationObserver 监听 `data-theme` 变化

### 层叠与布局（关键约束）

- 画布挂在 `.main-area`（非滚动区域），`position: absolute; inset: 0`，**固定不随内容滚动**
- `.main-area` 承担页面底色 `--color-bg-primary`；`.content` 背景改为 `transparent`（否则不透明背景会盖住画布）
- 层叠关系：画布 `z-index: 0` < `.content` / `.sidebar` `z-index: 1`（两者加 `position: relative`）
- 画布 `pointer-events: none`，鼠标跟踪监听 `.main-area` 的 mousemove/mouseleave

### 生命周期

- `_renderAbout()` 渲染首页后调用 `GridBackground.init(container)`
- `_cleanupHomeHero()` 中调用 `GridBackground.destroy()`（幂等，路由切换离开首页时自动清理）

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `js/grid-background.js` | 新增：Canvas 网格背景模块（GridBackground 对象） |
| `index.html` | 渲染模块脚本组新增 `grid-background.js` |
| `js/render-content.js` | `_renderAbout()` 中 init；`_cleanupHomeHero()` 中 destroy |
| `css/layout.css` | `.main-area` 加 `position: relative` + 承担底色；`.content` 背景透明 + `z-index: 1`；`.sidebar` 加 `z-index: 1` |
| `css/pages.css` | 新增 `.home-grid-canvas` 样式 |
| `css/variables.css` | 双主题新增 `--grid-line-rgb` / `--grid-line-alpha` |

---

## 卡片阴影统一（第十三次扩展 — 2026-08-16）

### 概述

统一全站卡片的阴影与悬浮效果：移除卡片外边框（深色主题下近黑色），默认状态卡片周围有较深外层阴影，鼠标悬浮时阴影变浅变小并上浮 2px，形成「卡片浮起」的视觉效果。此方案取代第九次扩展中 `--shadow-card`（0 1px 4px）作为卡片阴影的标准。

### 设计令牌

`css/variables.css` 新增两个变量（双主题定义）：

| 变量 | 深色主题 | 浅色主题 | 用途 |
|------|---------|---------|------|
| `--shadow-card-outer` | `0 0 14px rgba(0,0,0,0.45)` | `0 0 14px rgba(0,0,0,0.1)` | 卡片默认外层阴影（深、范围大） |
| `--shadow-card-outer-hover` | `0 0 6px rgba(0,0,0,0.15)` | `0 0 6px rgba(0,0,0,0.04)` | 卡片悬浮阴影（浅而小） |

`--shadow-card`（0 1px 4px）保留，仅用于头像等非卡片元素。

### 统一规则

所有卡片类（`.card`、`.blog-item`、`.project-card`、`.toolbox-card`、`.education-card`、`.greeting-card`、`.github-contributions`）：

- 移除 `border: 1px solid var(--color-border)`，卡片边界完全由阴影勾勒
- 默认 `box-shadow: var(--shadow-card-outer)` — 阴影深、范围大，卡片有贴地感
- hover：`box-shadow: var(--shadow-card-outer-hover)` + `transform: translateY(-2px)` — 阴影浅而小、卡片上浮，模拟浮起效果
- 过渡：`box-shadow var(--transition-normal), transform var(--transition-normal)`
- 问候卡片和 GitHub 贡献卡片原先硬编码的阴影值及 `[data-theme="light"]` 覆盖块删除，改用统一变量

### 涉及修改的文件

| 文件 | 修改点 |
|------|--------|
| `css/variables.css` | 双主题新增 `--shadow-card-outer` / `--shadow-card-outer-hover` |
| `css/components.css` | `.card` / `.blog-item` / `.project-card` / `.toolbox-card` 移除边框、改用外层阴影 + hover 悬浮 |
| `css/pages.css` | `.education-card` 同上；`.greeting-card` / `.github-contributions` 硬编码阴影改用统一变量 |

---

## 设计系统

### 配色方案

两种主题，通过 CSS 变量切换。

**深色主题（默认）**：
- 背景色：深灰调，类似 VS Code 暗色主题底色
- 前景/文字：浅灰白，保证对比度
- 强调色：低饱和度的蓝/青，用于链接、选中状态、代码关键字
- 边框/分割线：比背景略亮的灰色

**浅色主题**（第五次扩展 — 2026-08-03 重新设计）：

设计目标：暖白纸质感，文字对比度达到 WCAG AA/AAA，代码块配色柔和专业。

| 令牌 | 旧值 | 新值 | 说明 |
|------|------|------|------|
| `--color-bg-primary` | `#ffffff` | `#fdfcfb` | 主背景加极微暖调，避免纯白刺眼 |
| `--color-bg-secondary` | `#f5f5f5` | `#f3f1ef` | 次级背景加深，与主背景拉开层次 |
| `--color-bg-tertiary` | `#eaeaea` | `#e7e4e1` | 三级背景（代码块、顶部栏） |
| `--color-bg-hover` | `#e8e8e8` | `#eae6e2` | 悬停态，有暖调 |
| `--color-bg-card` | `#f9f9f9` | `#f7f5f3` | 卡片背景 |
| `--color-text-primary` | `#333333` | `#1a1a1a` | 正文加深，对比度 ~16:1 |
| `--color-text-secondary` | `#666666` | `#565555` | 辅助文字，对比度 ~7.5:1（AAA） |
| `--color-text-heading` | `#1a1a1a` | `#0d0d0d` | 标题更黑 |
| `--color-accent` | `#0078d4` | `#0d6bc3` | 强调色加深，对比度从 4.5→5.5:1 |
| `--color-accent-hover` | `#106ebe` | `#08529e` | 悬停态 |
| `--color-border` | `#d4d4d4` | `#cfccc9` | 边框可见度提升 |
| `--color-border-light` | `#c0c0c0` | `#bab6b2` | 较亮边框 |
| `--color-code-bg` | `#f3f3f3` | `#f3f1ef` | 代码块背景 |
| `--color-code-text` | `#333333` | `#1a1a1a` | 代码文字 |
| `--color-code-keyword` | `#0000ff` | `#0550ae` | 关键字（蓝，告别纯蓝） |
| `--color-code-string` | `#a31515` | `#0a644b` | 字符串（绿，告别暗红） |
| `--color-code-function` | `#795e26` | `#8250df` | 函数名（紫，VS Code 风格） |
| `--color-code-comment` | `#008000` | `#656d76` | 注释（灰，告别纯绿） |
| `--color-code-number` | `#098658` | `#0550ae` | 数字 |
| `--color-code-operator` | `#333333` | `#1a1a1a` | 运算符 |
| `--color-code-line-highlight` | `#e8e8e8` | `#eae6e2` | 当前行高亮 |
| `--scrollbar-thumb` | `#c0c0c0` | `#c4c0bb` | 滚动条滑块 |

代码块语法高亮配色对齐 VS Code Light+ 主题，不再使用纯红/纯绿/纯蓝。

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
│  导航栏：首页 | 学习心得 | 项目展示 | 学习资源 | 关于      │
├────────────┬────────────────────────────────┤
│            │                                │
│  左侧目录栏  │        中间内容展示区              │
│  （可折叠）  │        （独立滚动）                │
│            │                                │
│            │                                │
└────────────┴────────────────────────────────┘
```

**注意**：首页（`#about`）不显示左侧目录栏，内容区占满全部宽度。其余模块（博客、项目、学习资源、关于）保持左侧目录栏 + 内容区的双栏布局。

### 各区域详细说明

1. **顶部细栏（Top Bar）**
   - 高度约占视口 5%
   - 左侧：网站名称 / 你的名字（Standby-Time）
   - 右侧：日间/夜间模式切换按钮、搜索框（可后期实现搜索功能）、GitHub 仓库快捷访问图标
   - 通栏背景，与导航栏视觉区分

2. **导航栏（Nav Bar）**
   - 水平排列的大板块入口：首页、学习心得、项目展示、学习资源、关于
   - 当前活跃板块高亮
   - 点击切换中间内容区展示（SPA 模式，不刷新页面）

3. **左侧目录栏（Sidebar）**（第五次扩展 — 2026-08-03 调整尺寸）
   - 展示当前大板块下的子目录结构
   - 支持折叠/展开（手风琴或树形）
   - 宽度 210px（`--sidebar-width`），独立于中间内容区
   - 子目录项缩进较浅（`--space-sm + --space-lg` = 32px），节省横向空间
   - 目录项点击后中间内容区滚动到对应锚点（或切换内容）
   - **首页（`#about`）隐藏侧边栏**，其余模块正常显示

4. **中间内容展示区（Main Content）**
   - **独立滚动**：左侧目录和中间内容各自有独立的滚动容器，互不影响
   - 承载实际内容：个人介绍文字、博客文章、项目卡片等
   - 宽度自适应，填满剩余空间

### 滚动行为

- 左侧目录栏和中间内容区**各自独立滚动**
- 页面整体不出现全局滚动条（body 高度固定为视口高度）
- 使用 `overflow: hidden` 在 body，各区域内部使用 `overflow-y: auto`
- 首页（`#about`）无侧边栏，内容区单独滚动，占满全部可用宽度

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

1. **首页**：Hero 区（问候 + 打字机角色循环 + 3D 倾斜头像），居中双栏布局
2. **学习心得（博客）**：文章列表，按时间排列，支持分类/标签
3. **项目展示**：项目卡片（名称、描述、技术栈、GitHub/演示链接），点击卡片进入项目详情页；与 GitHub 独立仓库关联
4. **学习资源**：分类整理的在线学习资料，包括教程网站、机器学习资源、计算机系统经典课程等，以链接卡片形式展示
5. **关于**：教育经历、联系方式（邮箱、GitHub 等），左侧目录显示「关于我」和「联系方式」两个分类

### 路由设计

- 纯前端路由：使用 `hash`（`#about`、`#blog`、`#projects`、`#toolbox`、`#contact`）
  - 注：`#about` 为首页，`#contact` 为关于模块（历史原因保留 hash，导航标签已改为「关于」）
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
│   ├── grid-background.js  # 首页网格背景（Canvas 绘制 + 鼠标透镜放大）
│   ├── data.js             # 静态数据（博客、项目、个人信息等）
│   └── data-c-practice.js  # 题目数据（sync-c-practice.js 自动生成，不手动编辑）
└── assets/
    └── images/             # 图片资源
```
