/* ============================================================
 * data.js — 静态数据中心
 * 管理网站所有内容数据：个人信息、技能、项目、博客文章、联系方式
 * 后期可从独立 JSON 文件 fetch 加载，实现数据与页面完全解耦
 * ============================================================ */

/* ---------- 网站全局信息 ---------- */
const SITE_CONFIG = {
  name: "Standby-Time",
  githubUrl: "https://github.com/Standby-Time",
  description: "计算机专业学生 | 个人学习与项目展示网站",
};

/* ---------- 导航板块定义 ---------- */
const NAV_SECTIONS = [
  { id: "about",    label: "个人介绍", icon: "👤" },
  { id: "blog",     label: "学习心得", icon: "📝" },
  { id: "projects", label: "项目展示", icon: "💻" },
  { id: "toolbox",  label: "工具箱",   icon: "🧰" },
  { id: "contact",  label: "联系方式", icon: "📬" },
];

/* ---------- 个人介绍数据 ---------- */
const ABOUT_DATA = {
  name: "Standby-Time",
  title: "计算机专业学生",
  avatar: "",  // 头像图片路径，留空则使用文字占位
  bio: "热爱编程与开源，专注于计算机科学基础知识的学习与工程实践。\n喜欢用代码解决实际问题，热衷于探索新技术并分享学习心得。",
  skills: [
    { group: "编程语言", items: [
      { name: "C/C++", desc: "熟练掌握，能使用 STL 进行算法竞赛和日常开发，理解指针、内存管理等核心概念" },
      { name: "Python", desc: "熟练使用，能用 Flask 搭建 Web 应用，熟悉数据处理和自动化脚本编写" },
      { name: "JavaScript", desc: "掌握 ES6+ 语法，熟悉 DOM 操作和异步编程，能独立完成前端交互开发" },
      { name: "Java", desc: "掌握基础语法和面向对象编程，了解 JVM 基本原理和 Spring 框架基础" },
    ]},
    { group: "前端技术", items: [
      { name: "HTML/CSS", desc: "熟练使用语义化标签和 CSS3 布局（Flexbox/Grid），能实现响应式设计和主题系统" },
      { name: "React", desc: "了解组件化开发思想，能使用 Hooks 进行状态管理，有小型项目实践" },
      { name: "Vue", desc: "了解 Vue 3 Composition API 和单文件组件，能搭建简单的 SPA 应用" },
    ]},
    { group: "工具与平台", items: [
      { name: "Git/GitHub", desc: "熟练使用 Git 进行版本控制，熟悉分支管理、冲突解决和团队协作工作流" },
      { name: "VS Code", desc: "主力编辑器，熟悉调试配置、插件生态和自定义工作区设置" },
      { name: "Linux", desc: "掌握常用命令和 Shell 脚本编写，能在 Linux 环境下进行开发和部署" },
      { name: "Docker", desc: "了解容器化基本概念，能编写 Dockerfile 和使用 docker-compose 搭建开发环境" },
    ]},
  ],
  education: [
    {
      period: "大学期间",
      school: "计算机科学与技术专业",
      desc: "系统学习数据结构、算法、操作系统、计算机网络等核心课程，积极参与开源项目和技术社区。",
    },
  ],
};

/* ---------- 博客文章数据 ---------- */
/* 文章正文使用 Markdown 格式编写，渲染时通过 marked.js 转换为 HTML */
const BLOG_POSTS = [
  {
    id: "hello-world",
    title: "网站搭建记录：从零到部署",
    date: "2026-07-24",
    tags: ["前端", "项目"],
    summary: "记录个人网站从设计到实现的完整过程，包括技术选型、布局设计和代码实现思路。",
    contentMd: `\
## 为什么自己搭建网站？

作为一个计算机专业的学生，拥有一个个人网站不仅可以展示自己的学习成果，更是一个绝佳的实践项目。通过从零搭建网站，可以深入理解前端开发的方方面面。

## 技术选型

这个网站选择了最基础的前端三件套：

- **HTML** — 页面结构
- **CSS** — 样式与布局
- **JavaScript** — 交互逻辑

不引入任何框架的原因是：在真正理解框架之前，先扎实掌握基础。

## 设计思路

### 整体布局

网站采用经典的 "顶部导航 + 侧边栏 + 内容区" 布局：

- 顶部细栏放置品牌名、搜索框、GitHub 链接和主题切换
- 导航栏切换四大板块
- 左侧目录栏展示当前板块的子内容
- 中间内容区独立滚动

### 主题系统

通过 CSS 变量 (\`--color-*\`) 管理全部颜色，在 \`<html>\` 元素上切换 \`data-theme\` 属性即可实现深色/浅色主题切换。

### 代码展示

作为一个技术博客，代码块的展示非常重要。代码块风格参考了 VS Code Dark+ 主题，拥有独立的背景、等宽字体和正确的缩进。

## 后续计划

1. 引入 Markdown 渲染引擎，支持更丰富的文章格式
2. 接入 GitHub API，自动同步仓库信息
3. 添加移动端响应式适配
4. 部署到 GitHub Pages
`,
  },
  {
    id: "git-workflow",
    title: "Git 工作流实践总结",
    date: "2026-07-20",
    tags: ["工具", "Git"],
    summary: "总结日常开发中常用的 Git 命令和工作流程，帮助初学者快速上手版本控制。",
    contentMd: `\
## Git 基础概念

Git 是目前最流行的分布式版本控制系统。理解它的核心概念对高效开发至关重要。

## 常用命令

### 基本操作

\`\`\`
git init           # 初始化仓库
git add .          # 暂存所有更改
git commit -m "信息" # 提交更改
git status         # 查看状态
git log --oneline  # 查看提交历史
\`\`\`

### 分支管理

\`\`\`
git branch feature-xxx   # 创建分支
git checkout feature-xxx # 切换分支
git merge feature-xxx    # 合并分支
git branch -d feature-xxx # 删除分支
\`\`\`

## 工作流建议

1. **主分支保护** — \`main\` 分支只接受经过测试的稳定代码
2. **功能分支开发** — 每个功能/修复在独立分支进行
3. **提交信息规范** — 使用清晰的提交信息描述更改内容
4. **定期同步** — 频繁 \`pull\` 远程仓库，减少冲突

## 总结

Git 是程序员的必备技能，熟练使用它能大幅提升开发效率和协作体验。
`,
  },
  {
    id: "debug-mindset",
    title: "调试思维：如何高效定位 Bug",
    date: "2026-07-15",
    tags: ["方法论", "学习"],
    summary: "调试不仅仅是找错误，更是一种分析问题的思维方式。分享一些实用的调试技巧和心态。",
    contentMd: `\
## 调试不是玄学

很多初学者觉得调试代码是"玄学"——改一行代码，不知道为什么会好，也不知道为什么又会坏。这其实反映了对程序运行机制理解不足。

## 高效调试策略

### 1. 复现问题

第一步永远是**稳定复现** Bug。如果一个问题无法稳定复现，几乎不可能被真正修复。

### 2. 缩小范围

使用二分法快速缩小问题范围：
- 注释掉一半代码，看问题是否存在
- 逐步缩小可疑区域
- 对复杂逻辑使用断点单步执行

### 3. 理解而非猜测

> "不要为了修 Bug 而修 Bug。花时间去理解为什么它出错，比快速修掉它更重要。"

### 4. 善用工具

- **浏览器 DevTools**：断点调试、网络请求分析、性能分析
- **VS Code Debugger**：集成调试环境
- **\`console.log\`**：最简单也最常用的调试手段（但要记得删掉调试代码！）

## 心态建议

- **保持耐心** — 有些 Bug 需要时间和清醒的头脑
- **休息一下** — 离开屏幕5分钟往往比盯着看1小时更有效
- **记下来** — 把解决过的 Bug 和思路记录下来，形成自己的知识库
`,
  },
];

/* ---------- 项目展示数据 ---------- */
const PROJECTS = [
  {
    id: "my-website",
    name: "个人网站",
    category: "web",
    description: "从零搭建的个人品牌网站，纯前端三件套实现。支持深色/浅色双主题，博客 Markdown 渲染，项目展示等。",
    techStack: ["HTML", "CSS", "JavaScript", "Markdown"],
    githubUrl: "https://github.com/standby-time/standby-time.github.io",
    demoUrl: "https://standby-time.github.io",
    deployed: true,
    featured: true,
    contentMd: `\
## 项目背景

作为一名计算机专业学生，需要一个属于自己的线上空间——展示学习成果、记录成长轨迹、分享技术心得。与其使用现成的博客框架，不如从零搭建，把整个过程变成一个学习项目本身。

## 技术架构

网站采用**纯前端三件套**实现，不依赖任何框架或构建工具：

- **HTML** — 语义化标签搭建页面骨架
- **CSS** — 自定义属性（变量）驱动的主题系统，Flexbox / Grid 布局
- **JavaScript** — 模块化的 SPA 路由、数据驱动渲染

### 主题系统

通过 CSS 变量管理全部颜色，在 \`<html>\` 上切换 \`data-theme\` 属性即可一键切换深色/浅色主题。用户偏好通过 \`localStorage\` 持久化。

### 路由设计

基于 \`hashchange\` 事件的纯前端路由，支持子路由（如 \`#blog/post-id\`）。无需后端配置，刷新页面不会 404。

### 代码展示

作为技术博客，代码块的展示体验是重点。代码块风格参考 VS Code Dark+ 主题，顶部栏显示语言标签和复制按钮。

## 功能特性

- **欢迎页** — 打字机动画 + 渐变背景
- **个人介绍** — 基本信息、技能卡片、教育时间线
- **学习心得** — 博客列表 + 标签筛选 + Markdown 渲染详情
- **项目展示** — 卡片式布局，链接 GitHub 仓库和在线演示
- **工具箱** — 常用开发工具、网站、电子书资源汇总
- **联系方式** — 邮箱、GitHub 等联系方式展示

## 部署方案

通过 GitHub Actions 自动部署到 GitHub Pages，推送代码即上线。同时各独立项目仓库也可各自部署，主仓库通过链接聚合展示。
`,
  },
  {
    id: "code-snippets",
    name: "Code Snippets",
    category: "tools",
    description: "日常开发中积累的实用代码片段，涵盖算法模板、常用脚本、配置示例等。即取即用，提升开发效率。",
    techStack: ["Python", "JavaScript", "Shell"],
    githubUrl: "https://github.com/standby-time/code-snippets",
    demoUrl: "",
    deployed: false,
    featured: false,
    contentMd: `\
## 项目初衷

在日常学习和开发中，经常会重复用到一些代码片段——算法模板、数据处理脚本、配置文件模板等。与其每次去旧项目里翻找，不如统一整理到一个地方，随用随取。

## 内容分类

### 算法模板

常用算法和数据结构的模板实现，包含：

- 排序算法（快排、归并、堆排序）
- 图论算法（BFS、DFS、最短路径）
- 动态规划经典模板
- 树的遍历（前序、中序、后序、层序）

### Python 脚本

日常自动化和数据处理的实用脚本：

- 文件批量重命名
- JSON / CSV 数据处理
- 网页内容抓取
- Markdown 批量生成

### Shell 脚本

命令行效率工具：

- Git 常用操作封装
- 项目目录快速初始化
- 批量压缩 / 解压
- 日志分析和统计

### 配置模板

- \`.gitignore\` 模板（各语言通用版）
- VS Code \`settings.json\` 推荐配置
- ESLint / Prettier 配置
- Dockerfile 基础模板

## 使用方式

仓库按分类建立目录结构，每个片段独立文件，头部注释说明用途和参数。可以直接复制使用，也可以通过 \`curl\` 一键下载。
`,
  },
  {
    id: "leetcode-notes",
    name: "LeetCode 刷题笔记",
    category: "algo",
    description: "算法题解记录，包含题目分析、多种解法对比、复杂度分析。按数据结构和算法类型分类整理。",
    techStack: ["C++", "Python", "Algorithms"],
    githubUrl: "https://github.com/standby-time/leetcode-notes",
    demoUrl: "",
    deployed: false,
    featured: true,
    contentMd: `\
## 为什么做这个项目

算法能力是程序员的硬通货——无论是课程考试、技术面试还是工程实践，都离不开扎实的算法基础。刷题不是目的，通过刷题**深入理解数据结构和算法思想**才是目标。

## 笔记结构

每道题的笔记包含以下部分：

### 题目分析
- 题目要点提取
- 输入输出约束
- 边界条件分析

### 解法对比

| 解法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|-----------|-----------|---------|
| 暴力 | O(n²) | O(1) | 小数据量 |
| 优化 | O(n log n) | O(n) | 一般情况 |
| 最优 | O(n) | O(1) | 大数据量 |

### 核心代码

提供 C++ 和 Python 两种语言的实现，关键行有注释说明。

## 分类索引

- **数组 & 字符串** — 双指针、滑动窗口、前缀和
- **链表** — 快慢指针、反转、合并
- **树 & 图** — 遍历框架、树的构造、拓扑排序
- **动态规划** — 背包问题、区间 DP、状态压缩
- **回溯 & 搜索** — 全排列、组合、BFS 最短路径

## 方法论

> "理解一道题比刷十道题更有价值。"

每做完一道题，用自己的语言写一遍解题思路。如果遇到同类题目，对比它们的异同点，提炼出通用模板。
`,
  },
  {
    id: "dotfiles",
    name: "开发环境配置",
    category: "tools",
    description: "VS Code、终端、Git 等开发工具的配置文件集合，快速搭建顺手的开发环境。",
    techStack: ["Shell", "PowerShell", "JSON"],
    githubUrl: "https://github.com/standby-time/dotfiles",
    demoUrl: "",
    deployed: false,
    featured: false,
    contentMd: `\
## 项目定位

开发者都有自己的工具偏好和配置习惯。这个仓库用于管理个人的开发环境配置文件，方便在新设备上快速还原熟悉的工作环境。

## 包含内容

### VS Code 配置

- \`settings.json\` — 编辑器行为、格式化规则、主题设置
- \`keybindings.json\` — 自定义快捷键
- 推荐插件列表（\`extensions.json\`）

### 终端配置

**Windows Terminal**：
- 配色方案（One Dark 风格）
- 分屏快捷键
- 默认启动配置

**PowerShell Profile**：
- 常用别名（\`g\` → \`git\`，\`ll\` → \`ls -la\`）
- 路径跳转快捷命令
- \`oh-my-posh\` 主题配置

### Git 配置

- \`.gitconfig\` — 全局 Git 配置
- \`.gitignore_global\` — 系统级忽略规则（.DS_Store、Thumbs.db 等）
- 常用 Git 别名（\`git lg\` 美化日志等）

## 使用方式

\`\`\`bash
# 克隆仓库到本地
git clone https://github.com/standby-time/dotfiles.git ~/dotfiles

# 创建符号链接
cd ~/dotfiles
./install.sh   # 自动备份已有配置并创建软链接
\`\`\`

\`install.sh\` 脚本会自动检测已有配置、备份到 \`~/dotfiles-backup/\`，然后创建符号链接。不用担心覆盖。

## 跨平台支持

- **Windows** — VS Code + PowerShell + Windows Terminal
- **Linux** — bash + tmux + VS Code
- 各平台配置文件分目录存放，\`install.sh\` 自动检测系统类型
`,
  },
];

/* ---------- 项目分类定义（对应侧边栏目录结构） ---------- */
const PROJECT_CATEGORIES = [
  { id: "all",  label: "全部项目" },
  { id: "web",  label: "Web 开发" },
  { id: "algo", label: "算法 & 数据结构" },
  { id: "tools",label: "工具 & 配置" },
];

/* ---------- 联系方式数据 ---------- */
const CONTACT_DATA = {
  intro: "欢迎通过以下方式联系我，交流技术问题或合作项目。",
  methods: [
    { type: "email",    label: "邮箱",    value: "example@email.com", link: "mailto:example@email.com" },
    { type: "github",   label: "GitHub",  value: "github.com/Standby-Time", link: "https://github.com/Standby-Time" },
    { type: "blog",     label: "博客",    value: "技术博客（待开通）", link: "" },
  ],
};

/* ---------- 工具箱数据 ---------- */
const TOOLBOX_DATA = {
  tools: [
    { name: "JSON 在线解析", url: "https://www.json.cn", desc: "JSON 格式化、校验与转换工具" },
    { name: "在线正则测试", url: "https://regex101.com", desc: "正则表达式在线调试与测试" },
    { name: "Carbon 代码截图", url: "https://carbon.now.sh", desc: "生成精美的代码片段分享图" },
    { name: "Excalidraw", url: "https://excalidraw.com", desc: "手绘风格的在线白板与示意图工具" },
  ],
  websites: [
    { name: "菜鸟教程", url: "https://www.runoob.com", desc: "编程入门教程网站，涵盖多种语言和技术栈" },
    { name: "Hello 算法", url: "https://www.hello-algo.com", desc: "动画图解数据结构与算法，直观易理解" },
    { name: "MDN Web Docs", url: "https://developer.mozilla.org/zh-CN/", desc: "Mozilla 前端技术权威文档" },
    { name: "CS 自学指南", url: "https://csdiy.wiki", desc: "计算机科学自学路径与资源汇总" },
    { name: "GitHub", url: "https://github.com", desc: "全球最大的代码托管与协作平台" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", desc: "程序员问答社区，解决技术难题" },
  ],
  ebooks: [
    { name: "机器学习（西瓜书）", url: "https://github.com/...", desc: "周志华《机器学习》配套资源与公式推导" },
    { name: "CSAPP", url: "https://github.com/...", desc: "《深入理解计算机系统》学习笔记与实验" },
    { name: "算法导论", url: "https://github.com/...", desc: "CLRS 经典教材，算法学习必备参考" },
  ],
};

/* ---------- 侧边栏目录结构定义 ---------- */
/* 每个板块对应一个侧边栏配置：categories 为顶级分类，可包含子项 */
const SIDEBAR_CONFIG = {
  about: {
    title: "个人介绍",
    categories: [
      {
        id: "about-profile",
        label: "基本信息",
        subItems: [],                    /* 无子项时为锚点跳转 */
        anchor: "section-profile",
      },
      {
        id: "about-skills",
        label: "技能专长",
        subItems: [],
        anchor: "section-skills",
      },
      {
        id: "about-education",
        label: "教育经历",
        subItems: [],
        anchor: "section-education",
      },
    ],
  },
  blog: {
    title: "学习心得",
    categories: [
      {
        id: "blog-all",
        label: "全部文章",
        subItems: [],
        anchor: "blog-list-top",
        filter: "all",
      },
      {
        id: "blog-tags",
        label: "分类标签",
        subItems: [
          { id: "tag-前端", label: "前端", filter: "前端" },
          { id: "tag-工具", label: "工具", filter: "工具" },
          { id: "tag-学习", label: "学习", filter: "学习" },
          { id: "tag-方法论", label: "方法论", filter: "方法论" },
          { id: "tag-项目", label: "项目", filter: "项目" },
          { id: "tag-Git", label: "Git", filter: "Git" },
        ],
      },
    ],
  },
  projects: {
    title: "项目展示",
    categories: [
      {
        id: "proj-all",
        label: "全部项目",
        subItems: [],
        anchor: "projects-top",
        filter: "all",
      },
      {
        id: "proj-web",
        label: "Web 开发",
        subItems: PROJECTS.filter(p => p.category === "web").map(p => ({
          id: `proj-${p.id}`,
          label: p.name,
          anchor: `project-${p.id}`,
        })),
      },
      {
        id: "proj-algo",
        label: "算法 & 数据结构",
        subItems: PROJECTS.filter(p => p.category === "algo").map(p => ({
          id: `proj-${p.id}`,
          label: p.name,
          anchor: `project-${p.id}`,
        })),
      },
      {
        id: "proj-tools",
        label: "工具 & 配置",
        subItems: PROJECTS.filter(p => p.category === "tools").map(p => ({
          id: `proj-${p.id}`,
          label: p.name,
          anchor: `project-${p.id}`,
        })),
      },
    ],
  },
  toolbox: {
    title: "工具箱",
    categories: [
      {
        id: "toolbox-tools",
        label: "在线工具",
        subItems: [],
        anchor: "section-toolbox-tools",
      },
      {
        id: "toolbox-websites",
        label: "常用网站",
        subItems: [],
        anchor: "section-toolbox-websites",
      },
      {
        id: "toolbox-ebooks",
        label: "电子书",
        subItems: [],
        anchor: "section-toolbox-ebooks",
      },
    ],
  },
};
