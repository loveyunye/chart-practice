export default class Rule {
  // canvas: HTMLCanvasElement;
  // direction: number; // 1 horizontal、 0 vertical
  // isHorizontal: boolean; // 1 horizontal、 0 vertical
  // ratio: number; // 像素比
  // width!: number;
  // height!: number;
  // ticks: Array<number>; // 刻度 px 数组

  constructor(canvas, direction = 1) {
    this.canvas = canvas;
    this.direction = direction;
    this.ratio = window.devicePixelRatio || 1;
    this.ticks = [1, 2, 5, 10, 20, 50, 100];
  }

  // 绘制
  draw(scale = 1, start = 0) {
    // 获取ctx
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    // 设置像素比例
    this.setRatio(ctx);
    this.setAxis(ctx, scale, start);
  }

  // 设置像素比例
  setRatio(ctx) {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    const { ratio, width, height } = this;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    ctx.clearRect(0, 0, width, height);
  }

  // 绘制轴
  setAxis(ctx, scale, start) {
    // const { ratio, width, height, ticks } = this;
    const { ratio, width, height } = this;
    const line = height * ratio; // 刻度线长度
    const axis = width; // 轴长
    const startTick = start < 0 ? 0 : -Math.floor(start);
    const endTick = start < 0 ? axis - Math.floor(start) : axis;

    const lineWidth = 0.5 * ratio;
    ctx.strokeStyle = '#00ffff';

    // let actualTick;
    // if (scale > 1) {
    //   actualTick = Math.max(0, 2 - Math.round(scale - 1));
    // } else {
    //   actualTick = Math.min(ticks.length - 1, 2 + Math.round(1 / scale - 1));
    // }
    // const tick = ticks[actualTick]; // 刻度线长
    const tick = 8;
    const tickLong = (height - 32) * ratio; // 24 为上面文字、下面文字
    for (let j = startTick; j * tick < endTick / scale; j++) {
      ctx.lineWidth =
        j % 10 === 0
          ? lineWidth * 2
          : j % 5 === 0
          ? lineWidth * 1.5
          : lineWidth;
      const i = j * scale; // i => interval  每个格子间隔距离
      const from = {
        x: (i * tick + start) * ratio,
        y: j % 5 === 0 ? 16 * ratio : 16 * ratio + tickLong / 4,
      };
      const to = {
        x: (i * tick + start) * ratio,
        y: j % 10 === 0 ? line - 16 * ratio : line / 2,
      };
      this.drawLine(
        {
          x: from.x,
          y: from.y,
        },
        {
          x: to.x,
          y: to.y,
        },
        ctx,
      );
      const text = {
        x: (i * tick + start) * ratio + 2,
        y: 6 * ratio,
      };
      if (j % 10 === 0) {
        this.drawText(
          // j * tick,
          j * 5,
          ctx,
          {
            x: text.x,
            y: text.y,
          },
          ratio,
        );
      }
    }
    ctx.lineWidth = lineWidth * 2;
    // 绘制主线
    this.drawLine(
      {
        x: 0,
        y: line / 2,
      },
      {
        x: width * ratio,
        y: line / 2,
      },
      ctx,
    );
  }

  // 绘制文本
  drawText(tick, ctx, position, ratio) {
    // if (!isHorizontal) {
    //   ctx.save();
    //   ctx.translate(position.x, position.y);
    //   ctx.rotate(Math.PI / 2);
    // }
    const label = `${tick}米`;
    ctx.fillStyle = '#eee';
    ctx.font = `${10 * ratio}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(label, position.x - label.length * 6, position.y);
    ctx.restore();
  }

  // 绘制线段
  drawLine(from, to, ctx) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
  }
}
