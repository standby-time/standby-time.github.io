/* ============================================================
 * app.js — 应用主入口
 * 负责初始化所有模块、绑定全局事件、启动应用
 * 所有模块挂载在全局对象 App 下，避免变量污染
 * ============================================================ */

const App = {
  /**
   * 应用启动入口
   * 按顺序初始化各模块
   */
  init() {
    /* 1. 初始化主题（必须在渲染前，避免闪烁） */
    ThemeManager.init();

    /* 2. 等待 DOM 加载完成后初始化页面 */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this._onReady());
    } else {
      this._onReady();
    }
  },

  /**
   * DOM 就绪后的初始化逻辑
   */
  _onReady() {
    /* 绑定全局事件 */
    this._bindGlobalEvents();

    /* 页脚版权年份：始终显示当前年份 */
    const footerYear = document.getElementById("footerYear");
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }

    /* 3. 初始化路由（会触发首次渲染） */
    Router.init();
  },

  /**
   * 绑定全局事件（顶部栏按钮、导航栏点击等）
   */
  _bindGlobalEvents() {
    /* 主题切换按钮 */
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => ThemeManager.toggle());
    }

    /* 导航栏点击 */
    document.querySelectorAll(".nav__item").forEach(item => {
      item.addEventListener("click", () => {
        const section = item.dataset.section;
        if (section) {
          Router.go(`#${section}`);
        }
      });
    });

    /* 欢迎页"进入网站"按钮 */
    const enterBtn = document.getElementById("enterSiteBtn");
    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        Router.go("#about");
      });
    }

    /* 品牌名点击 → 回到欢迎页 */
    const brandName = document.getElementById("brandName");
    if (brandName) {
      brandName.addEventListener("click", () => Router.go("#welcome"));
    }

    /* 左侧书签按钮：折叠/展开目录栏 */
    const bookmark = document.getElementById("sidebarBookmark");
    if (bookmark) {
      bookmark.addEventListener("click", () => Sidebar.toggle());
    }

    /* 页脚显隐：内容区滚动到底端时淡入显示，离开底端时隐藏 */
    const contentEl = document.getElementById("mainContent");
    const footerEl = document.querySelector(".footer");
    if (contentEl && footerEl) {
      const toggleFooter = () => {
        const atBottom = contentEl.scrollTop + contentEl.clientHeight >= contentEl.scrollHeight - 8;
        footerEl.classList.toggle("footer--visible", atBottom);
      };

      contentEl.addEventListener("scroll", toggleFooter, { passive: true });
      window.addEventListener("resize", toggleFooter);
      /* 路由切换后内容高度变化，等渲染完成后再判断一次 */
      window.addEventListener("hashchange", () => requestAnimationFrame(toggleFooter));
      toggleFooter();
    }
  },
};

/* 启动应用 */
App.init();
