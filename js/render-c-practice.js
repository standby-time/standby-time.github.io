/* ============================================================
 * render-c-practice.js — C 语言刷题展示页渲染模块
 *
 * 渲染布局：左侧题目目录（独立滚动） + 右侧连续题目内容（独立滚动）
 * 功能：目录高亮跟随滚动（Intersection Observer）、点击目录项滑动、
 *       同一题多种解法分组展示、C 代码 8 类语法高亮（关键字/类型/预处理/
 *       函数/字符串/字符/数字/注释）、代码复制
 *
 * 入口：CPracticeRenderer.render(container, project)
 * ============================================================ */

const CPracticeRenderer = {
  _observer: null,

  /**
   * 入口：渲染刷题展示完整页面
   */
  render(container, project) {
    container.innerHTML = this._buildHTML(project);
    this._renderProblemList(container);
    this._renderProblemContent(container);
    this._setupScrollSpy(container);
    this._bindEvents(container);
    container.querySelector(".c-practice").scrollTop = 0;
  },

  _buildHTML(project) {
    return `
      <div class="c-practice">
        <div class="c-practice__back" id="ctBackBtn">← 返回项目列表</div>
        <div class="c-practice__header">
          <h1 class="c-practice__title">${this._esc(project.name)}</h1>
          ${project.githubUrl ? `
            <a class="btn btn--outline" href="${this._esc(project.githubUrl)}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub 源码
            </a>
          ` : ""}
        </div>
        <div class="c-practice__body">
          <aside class="c-practice__sidebar" id="ctSidebar">
            <div class="c-practice__sidebar-header">
              <span>📚 题目列表</span>
              <span class="c-practice__count">共 ${cPracticeProblems.length} 题</span>
            </div>
            <nav class="c-practice__nav" id="ctNav"></nav>
          </aside>
          <div class="c-practice__content" id="ctContent"></div>
        </div>
      </div>
    `;
  },

  _renderProblemList(container) {
    const nav = container.querySelector("#ctNav");
    if (!nav) return;

    nav.innerHTML = cPracticeProblems.map(p => `
      <div class="c-practice__nav-item" data-problem-id="${p.id}">
        <span class="c-practice__nav-num">#${p.id}</span>
        <span class="c-practice__nav-title">${this._esc(p.title)}</span>
      </div>
    `).join("");
  },

  _renderProblemContent(container) {
    const content = container.querySelector("#ctContent");
    if (!content) return;

    content.innerHTML = cPracticeProblems.map(p => {
      const hasMultiple = p.solutions.length > 1;

      /* 构建所有解法的 HTML */
      const solutionsHtml = p.solutions.map((sol, i) => `
        <div class="c-practice__solution">
          ${hasMultiple ? `<h3 class="c-practice__solution-label">${this._esc(sol.label)}</h3>` : ""}
          ${sol.approach ? `
            <details class="c-practice__approach" open>
              <summary class="c-practice__approach-summary">💡 解题思路${hasMultiple ? `（${this._esc(sol.label)}）` : ""}</summary>
              <div class="c-practice__approach-body">${this._esc(sol.approach).replace(/\n/g, "<br>")}</div>
            </details>
          ` : ""}
          <div class="code-block">
            <div class="code-block__header">
              <span class="code-block__lang">C</span>
              <span class="code-block__copy-btn">复制</span>
            </div>
            <pre class="c-practice__code"><code>${this._highlightC(sol.code)}</code></pre>
          </div>
        </div>
      `).join("");

      return `
        <section class="c-practice__problem" id="ctProblem${p.id}" data-problem-id="${p.id}">
          <h2 class="c-practice__problem-title">#${p.id} ${this._esc(p.title)}</h2>
          ${p.description ? `<p class="c-practice__problem-desc">${this._esc(p.description)}</p>` : ""}
          ${solutionsHtml}
        </section>
      `;
    }).join("");

    this._bindCopyButtons(content);
  },

  _highlightC(code) {
    let html = this._esc(code);
    const tokens = [];

    /* 先把注释、字符串、字符、预处理指令摘出占位（单遍匹配，互不误伤） */
    html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)'|#[ \t]*(?:include|define|undef|ifdef|ifndef|if|elif|else|endif|pragma|error|warning)\b)/g, (match) => {
      let type;
      if (match.startsWith("/*") || match.startsWith("//")) type = "comment";
      else if (match.startsWith('"')) type = "string";
      else if (match.startsWith("'")) type = "char";
      else type = "preprocessor";
      tokens.push({ text: match, type });
      return `@@HL${tokens.length - 1}@@`;
    });

    /* 类型关键字（先于普通关键字，避免重复匹配） */
    const types = ["char","double","float","int","long","short","signed","unsigned","void"];
    html = html.replace(new RegExp(`\\b(${types.join("|")})\\b`, "g"), '<span class="c-hl-type">$1</span>');

    /* 关键字 */
    const keywords = [
      "auto","break","case","const","continue","default","do",
      "else","enum","extern","for","goto","if","register","return",
      "sizeof","static","struct","switch","typedef","union","volatile","while",
      "NULL"
    ];
    html = html.replace(new RegExp(`\\b(${keywords.join("|")})\\b`, "g"), '<span class="c-hl-keyword">$1</span>');

    /* 函数调用：标识符后跟 (（前瞻不消耗字符，保留空格） */
    html = html.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="c-hl-function">$1</span>');

    /* 数字 */
    html = html.replace(/\b(\d+\.?\d*([eE][+-]?\d+)?)\b/g, '<span class="c-hl-number">$1</span>');

    /* 还原注释、字符串、字符、预处理指令 */
    const classMap = {
      comment: "c-hl-comment",
      string: "c-hl-string",
      char: "c-hl-char",
      preprocessor: "c-hl-preprocessor",
    };
    html = html.replace(/@@HL(\d+)@@/g, (match, i) => {
      const t = tokens[i];
      return `<span class="${classMap[t.type]}">${t.text}</span>`;
    });

    return html;
  },

  _setupScrollSpy(container) {
    if (this._observer) this._observer.disconnect();

    const navItems = container.querySelectorAll(".c-practice__nav-item");
    const contentEl = container.querySelector("#ctContent");
    if (!contentEl) return;

    let currentActiveId = null;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const problemId = entry.target.dataset.problemId;
          navItems.forEach(item => {
            const isActive = item.dataset.problemId === problemId;
            item.classList.toggle("c-practice__nav-item--active", isActive);
          });
          currentActiveId = problemId;
        }
      });

      if (currentActiveId === null) {
        const problems = contentEl.querySelectorAll(".c-practice__problem");
        for (const p of problems) {
          const rect = p.getBoundingClientRect();
          const contentRect = contentEl.getBoundingClientRect();
          if (rect.top >= contentRect.top && rect.top < contentRect.bottom) {
            navItems.forEach(item => {
              const isActive = item.dataset.problemId === p.dataset.problemId;
              item.classList.toggle("c-practice__nav-item--active", isActive);
            });
            break;
          }
        }
      }
    }, {
      root: contentEl,
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0
    });

    container.querySelectorAll(".c-practice__problem").forEach(el => {
      this._observer.observe(el);
    });
  },

  _bindEvents(container) {
    const backBtn = container.querySelector("#ctBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        Router.go("#projects");
      });
    }

    const nav = container.querySelector("#ctNav");
    if (nav) {
      nav.addEventListener("click", (e) => {
        const item = e.target.closest(".c-practice__nav-item");
        if (!item) return;
        const problemId = item.dataset.problemId;
        const target = container.querySelector(`#ctProblem${problemId}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  },

  _bindCopyButtons(contentEl) {
    contentEl.querySelectorAll(".code-block__copy-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const pre = btn.closest(".code-block").querySelector("pre");
        if (!pre) return;
        navigator.clipboard.writeText(pre.textContent).then(() => {
          btn.textContent = "已复制!";
          setTimeout(() => { btn.textContent = "复制"; }, 2000);
        }).catch(() => {
          btn.textContent = "复制失败";
          setTimeout(() => { btn.textContent = "复制"; }, 2000);
        });
      });
    });
  },

  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  },

  _esc(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },
};
