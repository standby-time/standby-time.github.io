/* ============================================================
 * render-content.js — 内容渲染模块
 * 根据当前板块渲染中间内容区，包含：
 *   个人介绍、博客列表/详情、项目展示、联系方式 的 HTML 生成逻辑
 * ============================================================ */

const ContentRenderer = {
  /* 当前筛选标签（博客页） */
  currentBlogFilter: "all",
  /* 当前项目分类 */
  currentProjectFilter: "all",

  /**
   * 入口：根据板块 ID 渲染内容区
   * @param {string} section - 板块 ID
   * @param {string} [subRoute] - 子路由
   */
  render(section, subRoute) {
    const contentEl = document.getElementById("mainContent");
    if (!contentEl) return;

    /* 离开 C 刷题页时清理（恢复 sidebar、断开 observer） */
    if (typeof CPracticeRenderer !== "undefined") {
      CPracticeRenderer.destroy();
    }

    /* 重置筛选状态 */
    this.currentBlogFilter = "all";
    this.currentProjectFilter = "all";

    switch (section) {
      case "about":    this._renderAbout(contentEl); break;
      case "blog":     this._renderBlog(contentEl, subRoute); break;
      case "projects": this._renderProjects(contentEl, subRoute); break;
      case "toolbox":  this._renderToolbox(contentEl); break;
      case "contact":  this._renderContact(contentEl); break;
      default:         this._render404(contentEl); break;
    }

    /* 滚动到内容区顶部 */
    contentEl.scrollTop = 0;
  },

  /**
   * 应用筛选（由侧边栏点击触发）
   * @param {string} filter - 筛选关键字
   */
  applyFilter(filter) {
    const section = Router.currentSection;
    const contentEl = document.getElementById("mainContent");
    if (section === "blog") {
      this.currentBlogFilter = filter;
      this._renderBlogList(contentEl);
      /* "全部文章" 滚动到列表顶部 */
      if (filter === "all" && contentEl) {
        contentEl.scrollTop = 0;
      }
    } else if (section === "projects") {
      this.currentProjectFilter = filter;
      this._renderProjects(contentEl);
      /* "全部项目" 滚动到页面顶部 */
      if (filter === "all" && contentEl) {
        contentEl.scrollTop = 0;
      }
    }
  },

  /* ================================================================
   * 个人介绍
   * ================================================================ */

  /**
   * 渲染个人介绍页
   * @param {HTMLElement} container - 内容区容器
   */
  _renderAbout(container) {
    const data = ABOUT_DATA;

    let html = `
      <!-- 基本信息 -->
      <section class="content__section" id="section-profile">
        <h2 class="content__section-title">个人介绍</h2>
        <div class="profile-header">
          <div class="profile-header__avatar">
            ${data.avatar
              ? `<img src="${data.avatar}" alt="头像">`
              : data.name.charAt(0).toUpperCase()}
          </div>
          <div class="profile-header__info">
            <h1 class="profile-header__name">${this._escape(data.name)}</h1>
            <p class="profile-header__title">${this._escape(data.title)}</p>
            <p class="profile-header__bio">${this._escape(data.bio).replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      </section>

      <!-- 技能专长 -->
      <section class="content__section" id="section-skills">
        <h2 class="content__section-title">技能专长</h2>
    `;

    /* 技能分组（小卡片形式） */
    data.skills.forEach(group => {
      html += `
        <div class="skills-group">
          <h3 class="skills-group__title">${this._escape(group.group)}</h3>
          <div class="skill-cards">
      `;
      group.items.forEach(skill => {
        html += `
          <div class="skill-card">
            <div class="skill-card__name">${this._escape(skill.name)}</div>
            <div class="skill-card__desc">${this._escape(skill.desc)}</div>
          </div>
        `;
      });
      html += `</div></div>`;
    });

    html += `</section>`;

    /* 教育经历 */
    html += `
      <section class="content__section" id="section-education">
        <h2 class="content__section-title">教育经历</h2>
        <div class="timeline">
    `;

    data.education.forEach(edu => {
      html += `
        <div class="timeline-item">
          <div class="timeline-item__period">${this._escape(edu.period)}</div>
          <div class="timeline-item__title">${this._escape(edu.school)}</div>
          <div class="timeline-item__desc">${this._escape(edu.desc)}</div>
        </div>
      `;
    });

    html += `
        </div>
      </section>
    `;

    container.innerHTML = html;
  },

  /* ================================================================
   * 学习心得（博客）
   * ================================================================ */

  /**
   * 渲染博客页（根据是否有子路由决定列表或详情）
   * @param {HTMLElement} container
   * @param {string} [postId] - 文章 ID
   */
  _renderBlog(container, postId) {
    if (postId) {
      /* 博客详情 */
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) {
        this._renderBlogDetail(container, post);
      } else {
        this._render404(container);
      }
    } else {
      this._renderBlogList(container);
    }
  },

  /**
   * 渲染博客文章列表
   * @param {HTMLElement} container
   */
  _renderBlogList(container) {
    const filter = this.currentBlogFilter;
    /* 根据标签筛选 */
    const filteredPosts = filter === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.tags.includes(filter));

    /* 收集所有文章标签（用于筛选按钮） */
    const allTags = new Set();
    BLOG_POSTS.forEach(p => p.tags.forEach(t => allTags.add(t)));

    /* 筛选标签栏 */
    let html = `
      <div class="content__section" id="blog-list-top">
        <h2 class="content__section-title">学习心得</h2>
        <div class="blog-filters">
          <span class="tag ${filter === "all" ? "tag--active" : ""}" data-filter="all">全部</span>
    `;

    allTags.forEach(tag => {
      html += `<span class="tag ${filter === tag ? "tag--active" : ""}" data-filter="${this._escape(tag)}">${this._escape(tag)}</span>`;
    });

    html += `</div><div class="blog-list">`;

    if (filteredPosts.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state__icon">📭</div>
          <p class="empty-state__text">暂无相关文章</p>
        </div>
      `;
    } else {
      filteredPosts.forEach(post => {
        html += `
          <article class="blog-item" data-post-id="${post.id}">
            <h3 class="blog-item__title">${this._escape(post.title)}</h3>
            <div class="blog-item__meta">
              <span>${this._escape(post.date)}</span>
              ${post.tags.map(t => `<span class="tag">${this._escape(t)}</span>`).join("")}
            </div>
            <p class="blog-item__summary">${this._escape(post.summary)}</p>
          </article>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;

    /* 绑定事件 */
    this._bindBlogListEvents(container);
  },

  /**
   * 渲染博客文章详情
   * @param {HTMLElement} container
   * @param {Object} post - 文章数据对象
   */
  _renderBlogDetail(container, post) {
    /* 使用 marked.js 将 Markdown 转为 HTML（在 index.html 中通过 CDN 引入） */
    const bodyHtml = typeof marked !== "undefined"
      ? marked.parse(post.contentMd)
      : `<pre>${this._escape(post.contentMd)}</pre>`;  /* 降级：纯文本显示 */

    container.innerHTML = `
      <div class="blog-detail">
        <div class="blog-detail__back" id="blogBackBtn">← 返回文章列表</div>
        <h1 class="blog-detail__title">${this._escape(post.title)}</h1>
        <div class="blog-detail__meta">
          <span>${this._escape(post.date)}</span>
          ${post.tags.map(t => `<span class="tag">${this._escape(t)}</span>`).join("")}
        </div>
        <div class="blog-detail__body">${bodyHtml}</div>
      </div>
    `;

    /* 为代码块添加顶部栏（语言标签 + 复制按钮） */
    this._enhanceCodeBlocks(container);

    /* 返回按钮事件 */
    const backBtn = container.querySelector("#blogBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        Router.go("#blog");
      });
    }
  },

  /**
   * 绑定博客列表事件（筛选、点击文章）
   * @param {HTMLElement} container
   */
  _bindBlogListEvents(container) {
    /* 筛选标签点击 */
    container.querySelectorAll(".blog-filters .tag").forEach(tag => {
      tag.addEventListener("click", () => {
        const filter = tag.dataset.filter;
        this.currentBlogFilter = filter;
        /* 同步更新侧边栏选中态 */
        this._syncSidebarFilter(filter);
        this._renderBlogList(container);
      });
    });

    /* 文章卡片点击 → 跳转详情 */
    container.querySelectorAll(".blog-item").forEach(item => {
      item.addEventListener("click", () => {
        const postId = item.dataset.postId;
        Router.go(`#blog/${postId}`);
      });
    });
  },

  /**
   * 同步侧边栏选中态（博客筛选时）
   * @param {string} filter
   */
  _syncSidebarFilter(filter) {
    const sidebarEl = document.getElementById("sidebar");
    if (!sidebarEl) return;

    sidebarEl.querySelectorAll(".sidebar__item").forEach(item => {
      const match = (filter === "all" && item.dataset.filter === "all")
                  || (item.dataset.filter === filter);
      item.classList.toggle("sidebar__item--active", match);
    });
  },

  /* ================================================================
   * 项目展示
   * ================================================================ */

  /**
   * 渲染项目展示页（列表或详情）
   * @param {HTMLElement} container
   * @param {string} [projectId] - 项目 ID（子路由）
   */
  _renderProjects(container, projectId) {
    if (projectId) {
      /* 项目详情页 */
      const project = PROJECTS.find(p => p.id === projectId);
      if (project) {
        /* 自定义渲染器（如 C 语言刷题页） */
        if (project.customRenderer === "c-practice-100-CaiNiao") {
          CPracticeRenderer.render(container, project);
        } else {
          this._renderProjectDetail(container, project);
        }
      } else {
        this._render404(container);
      }
    } else {
      this._renderProjectList(container);
    }
  },

  /**
   * 渲染项目列表
   * @param {HTMLElement} container
   */
  _renderProjectList(container) {
    const filter = this.currentProjectFilter;
    const filteredProjects = filter === "all"
      ? PROJECTS
      : PROJECTS.filter(p => p.category === filter);

    let html = `
      <div class="content__section" id="projects-top">
        <h2 class="content__section-title">项目展示</h2>
    `;

    /* 按分类展示（当筛选为 all 时）或在筛选结果上方显示说明 */
    if (filter === "all") {
      PROJECT_CATEGORIES.filter(c => c.id !== "all").forEach(cat => {
        const catProjects = PROJECTS.filter(p => p.category === cat.id);
        if (catProjects.length === 0) return;

        html += `
          <div class="project-category" id="category-${cat.id}">
            <h3 class="project-category__title">${this._escape(cat.label)}</h3>
            ${catProjects.map(p => this._buildProjectCard(p)).join("")}
          </div>
        `;
      });
    } else {
      if (filteredProjects.length === 0) {
        html += `
          <div class="empty-state">
            <div class="empty-state__icon">📂</div>
            <p class="empty-state__text">暂无相关项目</p>
          </div>
        `;
      } else {
        html += filteredProjects.map(p => this._buildProjectCard(p)).join("");
      }
    }

    html += `</div>`;
    container.innerHTML = html;

    /* 绑定项目卡片点击事件 */
    this._bindProjectCardEvents(container);

    /* 同步侧边栏选中态 */
    this._syncSidebarFilter(filter);
  },

  /**
   * 构建单个项目卡片 HTML
   * @param {Object} project - 项目数据对象
   * @returns {string} HTML 字符串
   */
  _buildProjectCard(project) {
    /* 是否显示演示链接：已部署 且 有 demoUrl */
    const showDemo = project.deployed && project.demoUrl;

    return `
      <div class="project-card" id="project-${project.id}" data-project-id="${project.id}">
        <div class="project-card__header">
          <h3 class="project-card__name">${this._escape(project.name)}${project.featured ? ' <span style="color: var(--color-code-string); font-size: 0.8rem;">★</span>' : ""}</h3>
          <div class="project-card__links">
            ${project.githubUrl ? `
              <a class="project-card__link project-card__link--github" href="${this._escape(project.githubUrl)}" target="_blank" rel="noopener" title="GitHub 源码">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>源码</span>
              </a>
            ` : ""}
            ${showDemo ? `
              <a class="project-card__link project-card__link--demo" href="${this._escape(project.demoUrl)}" target="_blank" rel="noopener" title="在线演示">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h5V3H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5h-2v5z"/></svg>
                <span>演示</span>
              </a>
            ` : ""}
          </div>
        </div>
        <p class="project-card__desc">${this._escape(project.description)}</p>
        <div class="project-card__tech">
          ${project.techStack.map(t => `<span class="tag tag--skill">${this._escape(t)}</span>`).join("")}
        </div>
      </div>
    `;
  },

  /**
   * 绑定项目卡片点击事件（事件委托）
   * 点击卡片主体 → 跳转项目详情页
   * 点击链接 → 不冒泡，正常执行链接跳转
   * @param {HTMLElement} container
   */
  _bindProjectCardEvents(container) {
    container.querySelectorAll(".project-card").forEach(card => {
      card.addEventListener("click", (e) => {
        /* 如果点击的是链接本身，不触发卡片跳转 */
        if (e.target.closest("a")) return;
        const projectId = card.dataset.projectId;
        if (projectId) {
          Router.go(`#projects/${projectId}`);
        }
      });
    });
  },

  /**
   * 渲染项目详情页
   * @param {HTMLElement} container
   * @param {Object} project - 项目数据对象
   */
  _renderProjectDetail(container, project) {
    const bodyHtml = typeof marked !== "undefined"
      ? marked.parse(project.contentMd || "")
      : `<pre>${this._escape(project.contentMd || "")}</pre>`;

    const showDemo = project.deployed && project.demoUrl;

    container.innerHTML = `
      <div class="project-detail">
        <div class="project-detail__back" id="projectBackBtn">← 返回项目列表</div>

        <div class="project-detail__header">
          <h1 class="project-detail__title">${this._escape(project.name)}${project.featured ? ' <span style="color: var(--color-code-string);">★</span>' : ""}</h1>

          <div class="project-detail__actions">
            ${project.githubUrl ? `
              <a class="btn btn--outline" href="${this._escape(project.githubUrl)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub 源码
              </a>
            ` : ""}
            ${showDemo ? `
              <a class="btn btn--primary" href="${this._escape(project.demoUrl)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h5V3H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5h-2v5z"/></svg>
                在线演示
              </a>
            ` : ""}
          </div>
        </div>

        <div class="project-detail__meta">
          <div class="project-detail__tech">
            ${project.techStack.map(t => `<span class="tag tag--skill">${this._escape(t)}</span>`).join("")}
          </div>
        </div>

        <div class="project-detail__body">${bodyHtml}</div>
      </div>
    `;

    /* 增强代码块 */
    this._enhanceCodeBlocks(container);

    /* 返回按钮 */
    const backBtn = container.querySelector("#projectBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        Router.go("#projects");
      });
    }
  },

  /* ================================================================
   * 工具箱
   * ================================================================ */

  /**
   * 渲染工具箱页
   * @param {HTMLElement} container
   */
  _renderToolbox(container) {
    const data = TOOLBOX_DATA;

    let html = `
      <div class="content__section">
        <h2 class="content__section-title">工具箱</h2>
        <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: var(--space-lg);">
          日常开发和学习中常用的在线工具、参考网站和电子书资源
        </p>
    `;

    /* 在线工具 */
    html += `
      <section class="content__section" id="section-toolbox-tools">
        <h3 class="content__subsection-title">在线工具</h3>
        <div class="toolbox-grid">
    `;
    data.tools.forEach(item => {
      html += this._buildToolboxCard(item);
    });
    html += `</div></section>`;

    /* 常用网站 */
    html += `
      <section class="content__section" id="section-toolbox-websites">
        <h3 class="content__subsection-title">常用网站</h3>
        <div class="toolbox-grid">
    `;
    data.websites.forEach(item => {
      html += this._buildToolboxCard(item);
    });
    html += `</div></section>`;

    /* 电子书 */
    html += `
      <section class="content__section" id="section-toolbox-ebooks">
        <h3 class="content__subsection-title">电子书</h3>
        <div class="toolbox-grid">
    `;
    data.ebooks.forEach(item => {
      html += this._buildToolboxCard(item);
    });
    html += `</div></section>`;

    html += `</div>`;
    container.innerHTML = html;
  },

  /**
   * 构建工具箱链接卡片
   * @param {Object} item - { name, url, desc }
   * @returns {string} HTML 字符串
   */
  _buildToolboxCard(item) {
    return `
      <a class="toolbox-card" href="${this._escape(item.url)}" target="_blank" rel="noopener">
        <div class="toolbox-card__name">${this._escape(item.name)}</div>
        <div class="toolbox-card__desc">${this._escape(item.desc)}</div>
        <div class="toolbox-card__url">${this._escape(item.url)}</div>
      </a>
    `;
  },

  /* ================================================================
   * 联系方式
   * ================================================================ */

  /**
   * 渲染联系方式页
   * @param {HTMLElement} container
   */
  _renderContact(container) {
    const data = CONTACT_DATA;

    let html = `
      <div class="content__section" id="section-contact-info">
        <h2 class="content__section-title">联系方式</h2>
        <div class="contact-section">
          <p class="contact-section__text">${this._escape(data.intro)}</p>
          <div class="contact-list">
    `;

    data.methods.forEach(method => {
      html += `
        <div class="contact-item">
          <div class="contact-item__icon">${this._getContactIcon(method.type)}</div>
          <div>
            <div class="contact-item__label">${this._escape(method.label)}</div>
            ${method.link
              ? `<a href="${this._escape(method.link)}" target="_blank" rel="noopener" class="contact-item__value">${this._escape(method.value)}</a>`
              : `<span class="contact-item__value">${this._escape(method.value)}</span>`
            }
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  /**
   * 获取联系方式图标
   * @param {string} type - 联系方式类型
   * @returns {string} 图标文字
   */
  _getContactIcon(type) {
    const icons = { email: "✉️", github: "🐙", blog: "📝", twitter: "🐦", wechat: "💬" };
    return icons[type] || "📌";
  },

  /* ================================================================
   * 404
   * ================================================================ */

  /**
   * 渲染 404 未找到页面
   * @param {HTMLElement} container
   */
  _render404(container) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <p class="empty-state__text">页面未找到</p>
      </div>
    `;
  },

  /* ================================================================
   * 工具函数
   * ================================================================ */

  /**
   * HTML 转义，防止 XSS
   * @param {string} str
   * @returns {string}
   */
  _escape(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * 增强代码块：为 <pre><code> 添加顶部栏（语言标签 + 复制按钮）
   * 处理 marked.js 渲染后的代码块
   * @param {HTMLElement} container
   */
  _enhanceCodeBlocks(container) {
    container.querySelectorAll("pre").forEach(pre => {
      /* 已经包装过则跳过 */
      if (pre.parentElement.classList.contains("code-block")) return;

      const codeEl = pre.querySelector("code");
      /* 从 marked.js 的 class（如 "language-javascript"）中提取语言名 */
      let lang = "";
      if (codeEl) {
        const classMatch = codeEl.className.match(/language-(\w+)/);
        lang = classMatch ? classMatch[1] : "";
      }

      /* 创建包装容器 */
      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      /* 顶部栏 */
      const header = document.createElement("div");
      header.className = "code-block__header";
      header.innerHTML = `
        <span class="code-block__lang">${lang}</span>
        <span class="code-block__copy-btn">复制</span>
      `;

      /* 替换 DOM 结构 */
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      /* 绑定复制按钮 */
      const copyBtn = header.querySelector(".code-block__copy-btn");
      copyBtn.addEventListener("click", () => {
        const code = pre.textContent;
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.textContent = "已复制!";
          setTimeout(() => { copyBtn.textContent = "复制"; }, 2000);
        }).catch(() => {
          copyBtn.textContent = "复制失败";
          setTimeout(() => { copyBtn.textContent = "复制"; }, 2000);
        });
      });
    });
  },
};
