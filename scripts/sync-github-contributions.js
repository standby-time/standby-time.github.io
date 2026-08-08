/* ============================================================
 * sync-github-contributions.js — GitHub 贡献数据同步脚本
 *
 * 调用 GitHub GraphQL API 获取指定用户过去一年的贡献日历数据，
 * 生成 js/data-github-contributions.js 供首页渲染使用。
 *
 * 用法：node scripts/sync-github-contributions.js [github-username]
 *
 * 需要环境变量：
 *   GH_TOKEN 或 GITHUB_TOKEN — GitHub Personal Access Token
 *   本地开发时：先手动设置 set GH_TOKEN=xxx && node scripts/...
 *   GitHub Actions 部署时：自动注入 secrets.GITHUB_TOKEN
 *
 * 若无 token，脚本跳过（exit 0），不阻塞部署。
 * ============================================================ */

const { writeFileSync, mkdirSync } = require("fs");
const path = require("path");

async function main() {
  const username = process.argv[2] || "standby-time";
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

  if (!token) {
    console.log("⚠️  未设置 GH_TOKEN，跳过 GitHub 贡献数据同步（本地开发或无权限）。");
    process.exit(0);
  }

  /* GraphQL 查询：获取过去一年的贡献日历（默认以当天所在周为最后一周） */
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;

  /* 将 contributionDays 数组拍平为 weeks[].days[] */
  const weeks = calendar.weeks.map(w => ({
    days: w.contributionDays.map(d => ({
      date: d.date,
      count: d.contributionCount,
      color: d.color,
    })),
  }));

  const data = {
    totalContributions: calendar.totalContributions,
    weeks,
  };

  const now = new Date().toISOString();
  const nDays = weeks.reduce((sum, w) => sum + w.days.length, 0);

  const output = `/* ============================================================
 * data-github-contributions.js — GitHub 贡献日历数据
 * 由 scripts/sync-github-contributions.js 自动生成，请勿手动编辑
 * 生成时间: ${now}
 * 用户: ${username}
 * 总贡献: ${data.totalContributions}
 * 天数: ${nDays} (${weeks.length} 周)
 * ============================================================ */

const GITHUB_CONTRIBUTIONS = ${JSON.stringify(data, null, 2)};
`;

  const outDir = path.resolve(__dirname, "..", "js");
  const outPath = path.join(outDir, "data-github-contributions.js");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, output, "utf-8");

  console.log(`✓ 同步完成：${data.totalContributions} 次贡献，${weeks.length} 周，${nDays} 天`);
}

main().catch(e => {
  console.error("✗ GitHub 贡献数据同步失败：", e.message);
  process.exit(1);
});
