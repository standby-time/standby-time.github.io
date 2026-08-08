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

    /* 离开首页时清理 Hero 资源（打字机定时器 + 3D 倾斜监听） */
    this._cleanupHomeHero();

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
    /* 如果从 C 刷题详情页切回列表，先清理 observer */
    if (typeof CPracticeRenderer !== "undefined") {
      CPracticeRenderer.destroy();
    }

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
   * 渲染首页（Hero 区：问候 + 打字机角色 + 3D 倾斜头像）
   * @param {HTMLElement} container - 内容区容器
   */
  _renderAbout(container) {
    const data = ABOUT_DATA;

    const html = `
      <section class="content__section" id="section-profile">
        <div class="home-hero" id="homeHero">
          <div class="home-hero__text">
            <h1 class="home-hero__greeting">Hi, I'm <span class="home-hero__name">${this._escape(data.name)}</span></h1>
            <p class="home-hero__role" id="heroRoleText"></p>
          </div>
          <div class="home-hero__visual" id="heroAvatarVisual">
            <div class="home-hero__glow" aria-hidden="true"></div>
            <div class="home-hero__avatar" id="heroAvatar">
              ${data.avatar
                ? `<img src="${this._escape(data.avatar)}" alt="${this._escape(data.name)} 的头像" decoding="async">`
                : `<span class="home-hero__avatar-initial" aria-hidden="true">${this._escape(data.name.charAt(0).toUpperCase())}</span>`}
            </div>
            <div class="home-hero__avatar-shadow" aria-hidden="true"></div>
          </div>
        </div>
      </section>
    `;

    container.innerHTML = html;

    /* 头像加载失败降级：显示名字首字母 */
    const avatarImg = container.querySelector("#heroAvatar img");
    if (avatarImg) {
      avatarImg.addEventListener("error", () => this._handleAvatarError(container, data.name), { once: true });
    }

    /* 启动角色打字机循环 + 3D 倾斜 */
    this._animateHeroRoles(container);
    this._bindHeroTilt(container);

    /* 加载 GitHub 贡献表格（动态加载数据脚本，不存在时静默跳过） */
    this._appendGitHubContributions(container);
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
   * 学习资源
   * ================================================================ */

  /**
   * 渲染学习资源页
   * @param {HTMLElement} container
   */
  _renderToolbox(container) {
    const data = LEARNING_RESOURCES;

    const categories = [
      { key: "ml",          id: "section-res-ml",          title: "机器学习" },
      { key: "cs-systems",  id: "section-res-cs-systems",  title: "计算机系统" },
      { key: "tutorials",   id: "section-res-tutorials",   title: "教程网站" },
      { key: "tools",       id: "section-res-tools",       title: "开发工具" },
    ];

    let html = `
      <div class="content__section">
        <h2 class="content__section-title">学习资源</h2>
        <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: var(--space-lg);">
          计算机专业学习资料与在线资源分类整理，包含机器学习、计算机系统、教程网站和开发工具
        </p>
    `;

    categories.forEach(cat => {
      const items = data[cat.key];
      if (!items || items.length === 0) return;

      html += `
        <section class="content__section" id="${cat.id}">
          <h3 class="content__subsection-title">${cat.title}</h3>
          <div class="toolbox-grid">
      `;
      items.forEach(item => {
        html += this._buildToolboxCard(item);
      });
      html += `</div></section>`;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  /**
   * 构建学习资源链接卡片
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
   * 关于（关于我 + 教育经历 + 联系方式）
   * ================================================================ */

  /**
   * 渲染关于页
   * @param {HTMLElement} container
   */
  _renderContact(container) {
    const edu = ABOUT_DATA.education;
    const contact = CONTACT_DATA;

    let html = `
      <!-- 关于我 -->
      <section class="content__section" id="section-about-me">
        <h2 class="content__section-title">关于我</h2>
        <div class="about-section">
          <p class="about-section__text">${this._escape(ABOUT_DATA.bio).replace(/\n/g, "<br>")}</p>
        </div>
      </section>

      <!-- 教育经历 -->
      <section class="content__section" id="section-education">
        <h2 class="content__section-title">教育经历</h2>
        <div class="education-card">
          <div class="education-card__header">
            <span class="education-card__school">${this._escape(edu.school)}</span>
            <span class="education-card__major">${this._escape(edu.major)}</span>
            <span class="education-card__period">${this._escape(edu.period)}</span>
          </div>
          <div class="education-card__courses">
            <span class="education-card__courses-label">核心课程</span>
            <div class="course-badges">
              ${edu.courses.map(c => `<span class="course-badge">${this._escape(c)}</span>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="content__section" id="section-contact-info">
        <h2 class="content__section-title">联系方式</h2>
        <div class="contact-section">
          <p class="contact-section__text">${this._escape(contact.intro)}</p>
          <div class="contact-list">
    `;

    contact.methods.forEach(method => {
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
      </section>
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

  /* ---------- 打字机速度常量 ---------- */
  _HERO_TYPE_SPEED: 60,
  _HERO_DELETE_SPEED: 35,
  _HERO_HOLD_MS: 1600,
  _HERO_GAP_MS: 400,

  /**
   * 角色循环打字机：typing → holding → deleting → gap → 下一个角色，无限循环
   * @param {HTMLElement} container - 内容区容器
   */
  _animateHeroRoles(container) {
    const roleEl = container.querySelector("#heroRoleText");
    if (!roleEl || typeof HERO_ROLES === "undefined" || HERO_ROLES.length === 0) return;

    let roleIndex = 0;
    let charIndex = 0;
    const self = this;

    function tick(phase) {
      const role = HERO_ROLES[roleIndex];

      if (phase === "typing") {
        if (charIndex < role.length) {
          roleEl.textContent = role.slice(0, charIndex + 1);
          charIndex++;
          self._heroTimer = setTimeout(() => tick("typing"), self._HERO_TYPE_SPEED);
        } else {
          self._heroTimer = setTimeout(() => tick("holding"), self._HERO_HOLD_MS);
        }
      } else if (phase === "holding") {
        self._heroTimer = setTimeout(() => tick("deleting"), self._HERO_DELETE_SPEED);
      } else if (phase === "deleting") {
        if (charIndex > 0) {
          charIndex--;
          roleEl.textContent = role.slice(0, charIndex);
          self._heroTimer = setTimeout(() => tick("deleting"), self._HERO_DELETE_SPEED);
        } else {
          self._heroTimer = setTimeout(() => tick("gap"), self._HERO_GAP_MS);
        }
      } else if (phase === "gap") {
        roleIndex = (roleIndex + 1) % HERO_ROLES.length;
        self._heroTimer = setTimeout(() => tick("typing"), self._HERO_TYPE_SPEED);
      }
    }

    this._heroTimer = setTimeout(() => tick("typing"), this._HERO_TYPE_SPEED);
  },

  /**
   * 3D 倾斜：鼠标在 Hero 区内移动时头像跟随旋转
   * @param {HTMLElement} container - 内容区容器
   */
  _bindHeroTilt(container) {
    const visualEl = container.querySelector("#heroAvatarVisual");
    const avatarEl = container.querySelector("#heroAvatar");
    if (!visualEl || !avatarEl) return;

    /* 触屏设备或用户偏好减弱动效：不启用倾斜 */
    if (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      const rect = avatarEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      /* 仅当鼠标在头像扩展区内时才响应（含 24px padding） */
      const visualRect = visualEl.getBoundingClientRect();
      if (e.clientX < visualRect.left || e.clientX > visualRect.right ||
          e.clientY < visualRect.top || e.clientY > visualRect.bottom) {
        return;
      }
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      visualEl.classList.add("home-hero__visual--tracking");
      visualEl.style.setProperty("--tilt-x", (px * 2).toFixed(3));
      visualEl.style.setProperty("--tilt-y", (-py * 2).toFixed(3));
    };

    const onLeave = () => {
      visualEl.classList.remove("home-hero__visual--tracking");
      visualEl.style.setProperty("--tilt-x", "0");
      visualEl.style.setProperty("--tilt-y", "0");
    };

    /* 监听整个 Hero 区域来检测鼠标离开，但只在 visualEl 范围内响应倾斜 */
    const heroEl = container.querySelector("#homeHero");
    heroEl.addEventListener("mousemove", onMove);
    visualEl.addEventListener("mouseleave", onLeave);

    this._heroEl = heroEl;
    this._heroMoveHandler = onMove;
    this._heroLeaveHandler = onLeave;
  },

  /**
   * 清理首页 Hero 资源（路由切换时调用）
   */
  _cleanupHomeHero() {
    if (this._heroTimer) {
      clearTimeout(this._heroTimer);
      this._heroTimer = null;
    }
    if (this._heroEl && this._heroMoveHandler) {
      this._heroEl.removeEventListener("mousemove", this._heroMoveHandler);
      this._heroEl.removeEventListener("mouseleave", this._heroLeaveHandler);
    }
    this._heroEl = null;
    this._heroMoveHandler = null;
    this._heroLeaveHandler = null;
  },

  /**
   * 头像加载失败降级：显示名字首字母
   * @param {HTMLElement} container - 内容区容器
   * @param {string} name - 用户名
   */
  _handleAvatarError(container, name) {
    const avatarEl = container.querySelector("#heroAvatar");
    if (!avatarEl) return;
    avatarEl.dataset.initial = name.charAt(0).toUpperCase();
    avatarEl.classList.add("home-hero__avatar--fallback");
  },

  /**
   * 动态加载 GitHub 贡献数据脚本，加载成功后渲染贡献图
   * 脚本不存在时（本地开发无同步数据）静默跳过
   * @param {HTMLElement} container - 内容区容器
   */
  _appendGitHubContributions(container) {
    /* 如果已经加载过（切换页面后再回到首页），直接渲染 */
    if (typeof GITHUB_CONTRIBUTIONS !== "undefined") {
      this._renderGitHubContributions(container, GITHUB_CONTRIBUTIONS);
      return;
    }

    const script = document.createElement("script");
    script.src = "js/data-github-contributions.js";
    script.onload = () => {
      if (typeof GITHUB_CONTRIBUTIONS !== "undefined") {
        this._renderGitHubContributions(container, GITHUB_CONTRIBUTIONS);
      }
    };
    script.onerror = () => {
      /* 本地开发无此文件，静默跳过 */
    };
    document.head.appendChild(script);
  },

  /**
   * 渲染 GitHub 贡献热力图
   * 7 行（Mon-Sun）× N 周，含月份标签和总数统计
   * @param {HTMLElement} container - 内容区容器
   * @param {Object} data - GITHUB_CONTRIBUTIONS 数据
   */
  _renderGitHubContributions(container, data) {
    if (!data || !data.weeks || data.weeks.length === 0) return;

    const profileSection = container.querySelector("#section-profile");
    if (!profileSection) return;

    /* 计算贡献等级 0-4，基于 GitHub API 返回的颜色（与 GitHub 完全同步） */
    function getLevel(color) {
      const MAP = {
        "#161b22": 0, "#ebedf0": 0,
        "#0e4429": 1, "#9be9a8": 1,
        "#006d32": 2, "#40c463": 2,
        "#26a641": 3, "#30a14e": 3,
        "#39d353": 4, "#216e39": 4,
      };
      return MAP[color] !== undefined ? MAP[color] : 0;
    }

    /* 生成周列的格子 HTML */
    let gridHtml = "";
    data.weeks.forEach(week => {
      gridHtml += '<div class="github-contributions__week">';
      week.days.forEach(day => {
        const level = getLevel(day.color);
        gridHtml += `<div class="github-contributions__day" data-level="${level}" style="background-color:${day.color}" title="${day.date}: ${day.count} contributions" aria-label="${day.date}: ${day.count} contributions"></div>`;
      });
      gridHtml += "</div>";
    });

    /* 生成月份标签：计算每月跨周数，12px/周（10px 格子 + 2px 间距） */
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthStarts = []; /* { month, weekIndex } */
    data.weeks.forEach((week, wi) => {
      if (week.days.length === 0) return;
      const m = new Date(week.days[0].date + "T12:00:00").getMonth();
      if (monthStarts.length === 0 || m !== monthStarts[monthStarts.length - 1].month) {
        monthStarts.push({ month: m, weekIndex: wi });
      }
    });
    let monthsHtml = "";
    for (let i = 0; i < monthStarts.length; i++) {
      const span = (i + 1 < monthStarts.length ? monthStarts[i + 1].weekIndex : data.weeks.length)
                 - monthStarts[i].weekIndex;
      if (span > 0) {
        monthsHtml += `<span class="github-contributions__month" style="width:${span * 12}px;">${MONTH_NAMES[monthStarts[i].month]}</span>`;
      }
    }

    /* 周标签 */
    const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

    const html = `
      <section class="github-contributions card" id="section-github-contributions">
        <div class="github-contributions__header">
          <span class="github-contributions__title">GitHub</span>
          <span class="github-contributions__total">${data.totalContributions} contributions in the last year</span>
        </div>
        ${monthsHtml ? `<div class="github-contributions__months">${monthsHtml}</div>` : ""}
        <div class="github-contributions__body">
          <div class="github-contributions__labels">
            ${DAY_LABELS.map(l => `<span class="github-contributions__label${l ? "" : " github-contributions__label--hidden"}">${l}</span>`).join("")}
          </div>
          <div class="github-contributions__grid-wrap">
            <div class="github-contributions__grid">
              ${gridHtml}
            </div>
          </div>
        </div>
        <div class="github-contributions__legend">
          <span class="github-contributions__legend-label">Less</span>
          <div class="github-contributions__legend-squares">
            <div class="github-contributions__day" data-level="0" style="background-color:#ebedf0"></div>
            <div class="github-contributions__day" data-level="1" style="background-color:#9be9a8"></div>
            <div class="github-contributions__day" data-level="2" style="background-color:#40c463"></div>
            <div class="github-contributions__day" data-level="3" style="background-color:#30a14e"></div>
            <div class="github-contributions__day" data-level="4" style="background-color:#216e39"></div>
          </div>
          <span class="github-contributions__legend-label">More</span>
        </div>
      </section>
    `;

    profileSection.insertAdjacentHTML("afterend", html);
  },

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
