/* ============================================================
 * sync-c-practice.js — C 语言刷题数据同步脚本
 *
 * 功能：扫描 .c 文件目录，按 ex1.c / ex1_2.c 命名规则分组
 *       （同一题号 → 一道题，多个文件 → 多种解法），
 *       解析「题目：」「思路：」头部注释，生成 js/data-c-practice.js
 *
 * 用法：node scripts/sync-c-practice.js <c-practice-100-CaiNiao 仓库目录路径>
 *
 * .c 文件头部约定：
 *   /*
 *   题目：<题目标题>
 *   思路：<解题思路>
 *   *\/
 *   之后的全部内容视为代码
 *
 * 文件命名规则：
 *   ex3.c      → 第3题 方法一
 *   ex3_2.c    → 第3题 方法二
 *   ex3_3.c    → 第3题 方法三
 * ============================================================ */

const fs = require("fs");
const path = require("path");

/* 命令行参数校验 */
const repoPath = process.argv[2];
if (!repoPath) {
  console.error("用法: node scripts/sync-c-practice.js <c-practice-100-CaiNiao 仓库目录路径>");
  process.exit(1);
}

const absPath = path.resolve(repoPath);
if (!fs.existsSync(absPath)) {
  console.error(`目录不存在: ${absPath}`);
  process.exit(1);
}

/* ============================================================
 * 扫描 .c 文件，按文件名排序
 * ============================================================ */
const cFiles = fs.readdirSync(absPath)
  .filter(f => f.endsWith(".c"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (cFiles.length === 0) {
  console.error("未找到任何 .c 文件");
  process.exit(1);
}

console.log(`找到 ${cFiles.length} 个 .c 文件`);

/* ============================================================
 * 解析文件名，提取基础题号和方案序号
 *   ex3.c    → { base: 3, method: 1 }
 *   ex3_2.c  → { base: 3, method: 2 }
 *   ex11.c   → { base: 11, method: 1 }
 * ============================================================ */
function parseFileName(fileName) {
  const match = fileName.match(/^ex(\d+)(?:_(\d+))?\.c$/);
  if (!match) return { base: 0, method: 1 };
  return {
    base: parseInt(match[1], 10),
    method: match[2] ? parseInt(match[2], 10) : 1,
  };
}

/* ============================================================
 * 解析单个 .c 文件的注释头和代码
 * ============================================================ */
function parseCFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");

  let title = "";
  let description = "";
  let approach = "";
  let code = raw;

  /* 匹配块注释头部 */
  const blockCommentRe = /^\/\*\s*\n([\s\S]*?)\*\/\s*\n/;
  const match = raw.match(blockCommentRe);

  if (match) {
    const commentBody = match[1];
    code = raw.slice(match[0].length);

    /* 解析 "题目：" → 短标题 + 题目描述 */
    const titleMatch = commentBody.match(/题目：(.+)/);
    if (titleMatch) {
      const afterTitle = commentBody.slice(
        commentBody.indexOf(titleMatch[0]) + titleMatch[0].length
      );
      const siIdx = afterTitle.indexOf("思路：");
      const fullTitle = siIdx !== -1
        ? (titleMatch[1] + afterTitle.slice(0, siIdx)).trim()
        : titleMatch[1].trim();

      const firstLine = fullTitle.split(/\n|。/)[0].trim();
      title = firstLine || fullTitle;
      const remainder = fullTitle.slice(firstLine.length).replace(/^[\n。\s]+/, "");
      description = remainder;
    }

    /* 解析 "思路：" 或 "思路（xxx）：" → 解题思路 */
    const descMatch = commentBody.match(/思路(?:（[^)]*）)?：([\s\S]*)$/);
    if (descMatch) {
      approach = descMatch[1].trim();
    }
  }

  return { title, description, approach, code };
}

/* ============================================================
 * 处理所有文件：解析 → 按基础题号分组
 * ============================================================ */
const groups = new Map();

cFiles.forEach(fileName => {
  const info = parseFileName(fileName);
  if (info.base === 0) {
    console.warn(`  ⚠ 无法解析文件名: ${fileName}，跳过`);
    return;
  }

  const filePath = path.join(absPath, fileName);
  const parsed = parseCFile(filePath);

  if (!groups.has(info.base)) {
    groups.set(info.base, {
      base: info.base,
      title: "",
      description: "",
      solutions: [],
    });
  }

  const group = groups.get(info.base);

  /* 第一份文件（方法一）的标题和描述作为题目的标题和描述 */
  if (info.method === 1) {
    group.title = parsed.title || fileName.replace(/\.c$/, "");
    group.description = parsed.description;
  }

  group.solutions.push({
    method: info.method,
    label: "",  // 稍后根据同组方案数量决定是否显示
    approach: parsed.approach,
    code: parsed.code,
    fileName: fileName,
  });

  console.log(`  ✓ ${fileName} → #${info.base} ${parsed.title || "(无标题)"} [方法${info.method}]`);
});

/* 每组内按方案序号排序，并设置 label */
const problems = [];
const sortedBases = [...groups.keys()].sort((a, b) => a - b);

sortedBases.forEach(base => {
  const group = groups.get(base);
  group.solutions.sort((a, b) => a.method - b.method);

  /* 只有一种解法时不显示 "方法一" 标签；多种解法时才显示 */
  if (group.solutions.length === 1) {
    group.solutions[0].label = "";
  } else {
    group.solutions.forEach((s, i) => {
      s.label = `方法${["", "一", "二", "三", "四", "五"][s.method] || s.method}`;
    });
  }

  problems.push(group);
});

/* ============================================================
 * 生成 JS 数据文件
 * ============================================================ */
const outputPath = path.resolve(__dirname, "..", "js", "data-c-practice.js");
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const esc = (s) => {
  if (!s) return "";
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
};

const items = problems.map(p => {
  const solItems = p.solutions.map(s => `      {
        label: '${esc(s.label)}',
        approach: '${esc(s.approach)}',
        code: '${esc(s.code)}',
        fileName: '${esc(s.fileName)}'
      }`).join(",\n");

  return `  {
    id: ${p.base},
    title: '${esc(p.title)}',
    description: '${esc(p.description)}',
    solutions: [
${solItems}
    ]
  }`;
}).join(",\n");

const output = `/* ============================================================
 * data-c-practice.js — C 语言刷题数据
 * 由 scripts/sync-c-practice.js 自动生成，请勿手动编辑
 * 生成时间: ${new Date().toISOString()}
 * 题目总数: ${problems.length}
 * ============================================================ */

const cPracticeProblems = [
${items}
];
`;

fs.writeFileSync(outputPath, output, "utf-8");
console.log(`\n已生成: ${outputPath}`);
console.log(`共 ${problems.length} 道题目`);

/* 统计多解法题目 */
const multiCount = problems.filter(p => p.solutions.length > 1).length;
if (multiCount > 0) {
  console.log(`其中 ${multiCount} 道题有多种解法`);
}
