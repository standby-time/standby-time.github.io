/* ============================================================
 * grid-background.js — 首页网格背景模块
 * 在首页内容区背后绘制细网格：
 * 1. 从页面左上角向其他角方向渐隐（CSS mask-image 椭圆遮罩，覆盖 70%）
 * 2. 鼠标附近网格顶点外推，形成透镜放大变形
 * 3. 线条颜色跟随主题 CSS 变量（--grid-line-rgb / --grid-line-alpha）
 * ============================================================ */

const GridBackground = {
  /* ---- 宿主与画布 ---- */
  host: null,        /* 挂载容器（.main-area，非滚动区域，画布固定不随内容滚动） */
  canvas: null,
  ctx: null,
  rafId: null,
  w: 0,
  h: 0,

  /* ---- 网格参数 ---- */
  spacing: 40,       /* 网格间距（px） */
  radius: 110,       /* 放大变形半径（px） */
  strength: 0.4,     /* 变形强度（最大位移 = strength * radius ≈ 44px） */

  /* ---- 鼠标跟踪（current 平滑逼近 target，形成拖尾） ---- */
  mouse: { x: -9999, y: -9999 },
  target: { x: -9999, y: -9999 },
  staticDrawn: false,  /* 鼠标远离且静态网格已绘制，跳过重绘省 CPU */

  /* ---- 主题 ---- */
  lineRgb: "255, 255, 255",
  lineAlpha: 0.3,
  themeObserver: null,
  reducedMotion: false,

  /* ---- 事件引用（解绑用） ---- */
  _moveHandler: null,
  _leaveHandler: null,
  _resizeHandler: null,

  /**
   * 初始化网格背景（首页渲染时调用，可重复调用）
   * @param {HTMLElement} container - 内容区容器（#mainContent）
   */
  init(container) {
    this.destroy();
    this.host = container.parentElement || container;
    this.mouse.x = this.mouse.y = -9999;
    this.target.x = this.target.y = -9999;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this._readColors();
    this._createCanvas();
    this._bindEvents();
    this._observeTheme();

    if (this.reducedMotion) {
      this._draw();   /* 减少动效偏好：只画静态网格，不启动动画循环 */
    } else {
      this._loop();
    }
  },

  /**
   * 销毁网格背景（离开首页时调用），幂等
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.host && this._moveHandler) {
      this.host.removeEventListener("mousemove", this._moveHandler);
      this.host.removeEventListener("mouseleave", this._leaveHandler);
    }
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }
    this.host = null;
    this.staticDrawn = false;
    this._moveHandler = null;
    this._leaveHandler = null;
    this._resizeHandler = null;
  },

  /* 读取主题对应的网格线颜色（CSS 变量，主题切换时由 observer 重新读取） */
  _readColors() {
    const styles = getComputedStyle(document.documentElement);
    const rgb = styles.getPropertyValue("--grid-line-rgb").trim();
    const alpha = parseFloat(styles.getPropertyValue("--grid-line-alpha"));
    if (rgb) this.lineRgb = rgb;
    if (!isNaN(alpha)) this.lineAlpha = alpha;
  },

  /* 创建画布并铺满宿主区域 */
  _createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "home-grid-canvas";
    this.host.prepend(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this._resize();
  },

  /* 同步画布尺寸（含高分屏缩放） */
  _resize() {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    this.w = this.host.clientWidth;
    this.h = this.host.clientHeight;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.staticDrawn = false;   /* 尺寸变化后需要重新绘制 */
  },

  /* 绑定鼠标与窗口事件 */
  _bindEvents() {
    this._moveHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.target.x = e.clientX - rect.left;
      this.target.y = e.clientY - rect.top;
    };
    this._leaveHandler = () => {
      this.target.x = -9999;
      this.target.y = -9999;
    };
    this._resizeHandler = () => {
      this._resize();
      if (this.reducedMotion) this._draw();
    };

    this.host.addEventListener("mousemove", this._moveHandler);
    this.host.addEventListener("mouseleave", this._leaveHandler);
    window.addEventListener("resize", this._resizeHandler);
  },

  /* 主题切换时重新读取线条颜色 */
  _observeTheme() {
    this.themeObserver = new MutationObserver(() => {
      this._readColors();
      this.staticDrawn = false;
      if (this.reducedMotion) this._draw();
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  },

  /* 动画循环：平滑跟踪鼠标 + 逐帧重绘（静止时跳过重绘） */
  _loop() {
    this.rafId = requestAnimationFrame(() => this._loop());

    /* 鼠标平滑跟踪，接近目标时直接吸附（避免永不收敛） */
    this.mouse.x += (this.target.x - this.mouse.x) * 0.15;
    this.mouse.y += (this.target.y - this.mouse.y) * 0.15;
    if (Math.abs(this.target.x - this.mouse.x) < 0.5 && Math.abs(this.target.y - this.mouse.y) < 0.5) {
      this.mouse.x = this.target.x;
      this.mouse.y = this.target.y;
    }

    /* 鼠标远离且静态网格已绘制时跳过重绘，节省 CPU */
    const active = this.mouse.x > -9000;
    if (active || !this.staticDrawn) {
      this._draw();
      this.staticDrawn = !active;
    }
  },

  /* 单帧绘制：网格线 + 鼠标放大变形 + 左上角径向渐变遮罩 */
  _draw() {
    const { ctx, w, h, spacing } = this;
    if (!ctx || w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${this.lineRgb}, ${this.lineAlpha})`;

    const mx = this.mouse.x;
    const my = this.mouse.y;

    /* 竖线 */
    for (let x = 0; x <= w; x += spacing) {
      ctx.beginPath();
      for (let y = 0; y <= h; y += spacing) {
        const p = this._distort(x, y, mx, my);
        if (y === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    /* 横线 */
    for (let y = 0; y <= h; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += spacing) {
        const p = this._distort(x, y, mx, my);
        if (x === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    /* 渐隐由 CSS mask-image 承担（椭圆遮罩，左上角向其他角方向 70% 覆盖） */
  },

  /**
   * 顶点变形：距鼠标 radius 内的顶点沿远离鼠标方向推移，
   * 形成透镜放大效果（越靠近鼠标推移越大）
   * @param {number} x - 顶点横坐标
   * @param {number} y - 顶点纵坐标
   * @param {number} mx - 鼠标横坐标
   * @param {number} my - 鼠标纵坐标
   * @returns {{x: number, y: number}} 变形后的坐标
   */
  _distort(x, y, mx, my) {
    if (mx < -9000) return { x, y };
    const dx = x - mx;
    const dy = y - my;
    const d = Math.hypot(dx, dy);
    if (d < 1 || d >= this.radius) return { x, y };
    const t = 1 - d / this.radius;
    const push = this.strength * this.radius * t * t;
    return { x: x + (dx / d) * push, y: y + (dy / d) * push };
  },
};
