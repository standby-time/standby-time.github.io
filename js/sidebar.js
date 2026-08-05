/* ============================================================
 * sidebar.js — 侧边栏目录模块
 * 根据当前板块动态生成目录结构，支持分类折叠/展开、锚点跳转
 * ============================================================ */

const Sidebar = {
  /* 当前展开的分类 ID 集合 */
  openCategories: new Set(),

  /**
   * 渲染侧边栏目录
   * @param {string} section - 当前板块 ID
   */
  render(section) {
    const sidebarEl = document.getElementById("sidebar");
    const bookmark = document.getElementById("sidebarBookmark");

    /* 首页不显示侧边栏和书签按钮 */
    if (section === "about") {
      if (sidebarEl) {
        sidebarEl.innerHTML = "";
        sidebarEl.classList.add("hidden");
      }
      if (bookmark) bookmark.classList.add("hidden");
      return;
    }

    /* 从首页切换到其他模块时恢复显示 */
    if (sidebarEl) sidebarEl.classList.remove("hidden");
    if (bookmark) bookmark.classList.remove("hidden");

    const config = SIDEBAR_CONFIG[section];

    if (!sidebarEl || !config) {
      /* 无对应配置时清空侧边栏 */
      if (sidebarEl) sidebarEl.innerHTML = "";
      return;
    }

    /* 构建 HTML（书签按钮在 HTML 中，不在此渲染） */
    let html = `
      <div class="sidebar__category" style="cursor: default; color: var(--color-text-heading); font-size: 0.85rem; text-transform: none; letter-spacing: 0;">
        ${config.title}
      </div>
    `;

    /* 遍历顶级分类 */
    config.categories.forEach(cat => {
      const hasSubItems = cat.subItems && cat.subItems.length > 0;
      const isOpen = this.openCategories.has(cat.id);
      /* 默认展开第一个分类 */
      if (this.openCategories.size === 0 && config.categories.indexOf(cat) === 0) {
        this.openCategories.add(cat.id);
      }
      const actuallyOpen = isOpen || (this.openCategories.size === 0 && config.categories.indexOf(cat) === 0);

      html += `
        <div class="sidebar__category" data-category-id="${cat.id}">
          <span>${cat.label}</span>
          ${hasSubItems ? `<span class="sidebar__category-arrow ${actuallyOpen ? "sidebar__category-arrow--open" : ""}">▶</span>` : ""}
        </div>
        <ul class="sidebar__list ${actuallyOpen ? "sidebar__list--open" : ""}">
      `;

      /* 子项 */
      if (hasSubItems) {
        cat.subItems.forEach(item => {
          html += `
            <li class="sidebar__item sidebar__item--sub"
                data-anchor="${item.anchor || ""}"
                data-filter="${item.filter || ""}"
                data-id="${item.id}">
              ${item.label}
            </li>
          `;
        });
      } else if (cat.anchor || cat.filter) {
        /* 无子项但有锚点或筛选：分类本身也是可点击项 */
        html += `
          <li class="sidebar__item" data-anchor="${cat.anchor || ""}" data-filter="${cat.filter || ""}">
            ${cat.label}
          </li>
        `;
      }

      html += `</ul>`;
    });

    sidebarEl.innerHTML = html;
    this._bindEvents(sidebarEl);
  },

  /**
   * 绑定侧边栏交互事件（事件委托）
   * @param {HTMLElement} sidebarEl - 侧边栏容器元素
   */
  _bindEvents(sidebarEl) {
    /* 分类标题：折叠/展开 */
    sidebarEl.querySelectorAll(".sidebar__category[data-category-id]").forEach(catEl => {
      catEl.addEventListener("click", () => {
        const catId = catEl.dataset.categoryId;
        this._toggleCategory(catEl, catId);
      });
    });

    /* 目录项：锚点跳转或筛选 */
    sidebarEl.querySelectorAll(".sidebar__item").forEach(item => {
      item.addEventListener("click", () => {
        const anchor = item.dataset.anchor;
        const filter = item.dataset.filter;

        /* 更新选中态 */
        sidebarEl.querySelectorAll(".sidebar__item").forEach(el => {
          el.classList.remove("sidebar__item--active");
        });
        item.classList.add("sidebar__item--active");

        if (anchor) {
          /* 滚动到内容区对应锚点 */
          const target = document.getElementById(anchor);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        if (filter) {
          /* 触发内容区的筛选逻辑 */
          ContentRenderer.applyFilter(filter);
        }
      });
    });

  },

  /**
   * 切换分类的折叠/展开状态
   * @param {HTMLElement} catEl - 分类标题元素
   * @param {string} catId - 分类 ID
   */
  _toggleCategory(catEl, catId) {
    const listEl = catEl.nextElementSibling;
    const arrowEl = catEl.querySelector(".sidebar__category-arrow");

    if (!listEl || !listEl.classList.contains("sidebar__list")) return;

    const isOpen = listEl.classList.contains("sidebar__list--open");

    if (isOpen) {
      listEl.classList.remove("sidebar__list--open");
      if (arrowEl) arrowEl.classList.remove("sidebar__category-arrow--open");
      this.openCategories.delete(catId);
    } else {
      listEl.classList.add("sidebar__list--open");
      if (arrowEl) arrowEl.classList.add("sidebar__category-arrow--open");
      this.openCategories.add(catId);
    }
  },

  /**
   * 折叠/展开整个侧边栏（由书签按钮触发）
   */
  toggle() {
    const sidebarEl = document.getElementById("sidebar");
    const bookmark = document.getElementById("sidebarBookmark");
    if (!sidebarEl) return;

    const isCollapsed = sidebarEl.classList.toggle("sidebar--collapsed");

    /* 更新书签图标和位置 */
    if (bookmark) {
      if (isCollapsed) {
        bookmark.classList.add("sidebar-bookmark--collapsed");
        bookmark.innerHTML = "▶";
        bookmark.title = "展开目录栏";
      } else {
        bookmark.classList.remove("sidebar-bookmark--collapsed");
        bookmark.innerHTML = "◀";
        bookmark.title = "折叠目录栏";
      }
    }
  },
};
