/* ============================================================
 * router.js — 前端路由模块
 * 基于 hash 的 SPA 路由：监听 hashchange 事件切换页面板块
 * 入口路由 #welcome 显示欢迎页，其他路由显示主页面 + 对应板块
 * ============================================================ */

const Router = {
  /* 当前活跃的板块 ID */
  currentSection: null,

  /**
   * 初始化路由：读取当前 hash 并渲染，绑定 hashchange 事件
   */
  init() {
    /* 无 hash 时默认跳转到欢迎页 */
    if (!location.hash) {
      location.hash = "#welcome";
    }

    this.handleRoute();
    window.addEventListener("hashchange", () => this.handleRoute());
  },

  /**
   * 处理路由变化：解析 hash，决定显示欢迎页还是主页面板块
   */
  handleRoute() {
    const hash = location.hash.slice(1) || "welcome"; /* 去掉 # 号 */
    const [section, subRoute] = hash.split("/");       /* 支持 #blog/post-id 二级路由 */

    if (section === "welcome") {
      this.showWelcome();
      return;
    }

    /* 非欢迎页：确保主页面可见，隐藏欢迎页 */
    this.showMainPage();
    this.navigateTo(section, subRoute);
  },

  /**
   * 显示欢迎页
   */
  showWelcome() {
    const welcomePage = document.getElementById("welcomePage");
    const mainPage = document.getElementById("mainPage");

    if (welcomePage) welcomePage.classList.remove("welcome-page--hidden");
    if (mainPage) mainPage.classList.add("hidden");
  },

  /**
   * 显示主页面（隐藏欢迎页）
   */
  showMainPage() {
    const welcomePage = document.getElementById("welcomePage");
    const mainPage = document.getElementById("mainPage");

    if (welcomePage) welcomePage.classList.add("welcome-page--hidden");
    if (mainPage) mainPage.classList.remove("hidden");
  },

  /**
   * 导航到指定板块
   * @param {string} section - 板块 ID（about / blog / projects / contact）
   * @param {string} [subRoute] - 子路由（如博客文章 ID）
   */
  navigateTo(section, subRoute) {
    /* 更新导航栏选中态 */
    this.updateNavActive(section);

    /* 渲染侧边栏目录 */
    Sidebar.render(section);

    /* 渲染中间内容区 */
    ContentRenderer.render(section, subRoute);

    this.currentSection = section;
  },

  /**
   * 更新导航栏高亮项
   * @param {string} section - 当前板块 ID
   */
  updateNavActive(section) {
    document.querySelectorAll(".nav__item").forEach(item => {
      const isActive = item.dataset.section === section;
      item.classList.toggle("nav__item--active", isActive);
    });
  },

  /**
   * 编程式导航（供点击事件调用）
   * @param {string} hash - 目标 hash（如 "#about"）
   */
  go(hash) {
    location.hash = hash;
  },
};
