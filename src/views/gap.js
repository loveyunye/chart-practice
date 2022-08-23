// 中央隔离带
export default class Gap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ratio = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.initHandler();
  }

  // 初始化操作
  initHandler() {
    // 获取ctx
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    this.ctx = ctx;
    const { ratio, width, height } = this;

    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
  }

  draw() {
    if (!this.ctx) {
      return false;
    }
    const { width, height, ratio, ctx } = this;
    ctx.clearRect(0, 0, width * ratio, height * ratio);
    this.drawTopLine();
  }

  // 绘制顶部线段
  drawTopLine() {
    const { ratio, ctx, width, height } = this;
    ctx.strokeStyle = '#4199EA';
    ctx.lineWidth = ratio * 2;
    this.drawLine(
      {
        x: 0,
        y: 2 / 2,
      },
      {
        x: width,
        y: 2 / 2,
      },
    );

    for (let i = 0; i < Math.floor((width + height - 2) / 10); i++) {
      ctx.strokeStyle = 'rgba(65, 153, 234, 0.4)';
      ctx.lineWidth = ratio * 1;
      this.drawLine(
        {
          x: i * 10,
          y: 2,
        },
        {
          x: i * 10 - (height - 2),
          y: height,
        },
      );
    }

    ctx.fillStyle = '#fff';
    ctx.font = `900 ${18 * ratio}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(
      '中央分隔带',
      (width / 2 - 60) * ratio,
      ((height + 2) / 2) * ratio,
    );
  }

  // 绘制线段
  drawLine(from, to, dash = []) {
    const { ctx, ratio } = this;
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(from.x * ratio, from.y * ratio);
    ctx.lineTo(to.x * ratio, to.y * ratio);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }
}
