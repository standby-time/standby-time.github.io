/* ============================================================
 * theme.js — 主题切换模块
 * 管理深色/浅色主题的切换，偏好持久化到 localStorage
 * ============================================================ */

const ThemeManager = {
  /* 主题键名 */
  STORAGE_KEY: "site-theme",
  DEFAULT_THEME: "dark",

  /**
   * 初始化主题：从 localStorage 读取偏好，无记录则默认深色
   */
  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
    this.apply(savedTheme);
  },

  /**
   * 应用主题：在 <html> 上设置 data-theme 属性
   * @param {"dark"|"light"} theme - 主题名称
   */
  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleIcon(theme);
  },

  /**
   * 切换主题：深色 ↔ 浅色
   */
  toggle() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || this.DEFAULT_THEME;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.apply(newTheme);
  },

  /**
   * 获取当前主题
   * @returns {"dark"|"light"}
   */
  getCurrent() {
    return document.documentElement.getAttribute("data-theme") || this.DEFAULT_THEME;
  },

  /**
   * 更新切换按钮图标
   * @param {"dark"|"light"} theme
   */
  updateToggleIcon(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    /* 深色主题时显示月亮图标（点击切换到浅色），浅色时显示太阳 */
    btn.textContent = theme === "dark" ? "🌙" : "☀️";
    btn.setAttribute("title", theme === "dark" ? "切换浅色模式" : "切换深色模式");
  },
};
