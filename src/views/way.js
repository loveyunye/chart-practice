import arrow from './arrow.png';

export default class Way {
  constructor(canvas) {
    this.canvas = canvas;
    this.ratio = window.devicePixelRatio || 1;
  }

  async draw() {
    // 获取ctx
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    this.ctx = ctx;
    // 设置像素比例
    this.setRatio(ctx);
    await this.drawMain();
    this.drawArea();
  }

  // 设置像素比例
  setRatio() {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    const { ratio, width, height, ctx } = this;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    ctx.clearRect(0, 0, width, height);
  }

  // 绘制
  drawMain() {
    return new Promise((resolve) => {
      const { ratio, ctx, width, height } = this;
      ctx.strokeStyle = '#4199EA';
      ctx.lineWidth = ratio * 3;

      // 绘制分割线
      this.drawLine(
        {
          x: 0,
          y: 0 + (3 / 2) * ratio,
        },
        {
          x: width * ratio,
          y: 0 + (3 / 2) * ratio,
        },
        ctx,
      );
      this.drawLine(
        {
          x: 0,
          y: height * ratio - (3 / 2) * ratio,
        },
        {
          x: width * ratio,
          y: height * ratio - (3 / 2) * ratio,
        },
        ctx,
      );

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = ratio * 7;

      const wayHeight = Math.ceil((height - 3 * 2 - 14) / 3);
      this.drawLine(
        {
          x: 0,
          y: height * ratio - (wayHeight + 3 + 7 / 2) * ratio,
        },
        {
          x: width * ratio,
          y: height * ratio - (wayHeight + 3 + 7 / 2) * ratio,
        },
        ctx,
      );

      this.drawLine(
        {
          x: 0,
          y: (wayHeight + 3 + 7 / 2) * ratio,
        },
        {
          x: width * ratio,
          y: (wayHeight + 3 + 7 / 2) * ratio,
        },
        ctx,
        [200, 160],
      );

      const imgObj = new Image();
      imgObj.src = arrow;
      //待图片加载完后，将其显示在canvas上
      imgObj.onload = () => {
        //ctx.drawImage(img, 0, 0,1024,768);//改变图片的大小到1024*768
        const firstHeight = 3 + wayHeight / 2; // 1车道高度
        const twoHeight = 3 + wayHeight + 7 + wayHeight / 2; // 2车道高度
        const imgNumber = Math.floor((width * ratio) / 200);
        [firstHeight, twoHeight].forEach((height) => {
          Array(imgNumber)
            .fill(height)
            .forEach((i, index) => {
              ctx.drawImage(
                imgObj,
                50 + index * 160 * ratio,
                (i - 6) * ratio,
                50 * ratio,
                12 * ratio,
              );
            });
        });
        resolve();
      };
    });
  }

  // 画区域
  drawArea() {
    this.drawAreaFun(0, 300, 'rgba(0, 255, 6, 0.3)');
    this.drawAreaTitle(0, 300, 'S');

    this.drawAreaFun(300, 200, 'rgba(0, 234, 255, 0.3)');
    this.drawAreaTitle(300, 200, 'L', 's');

    this.drawAreaFun(500, 100, 'rgba(0, 61, 234, 0.3)');
    this.drawAreaTitle(500, 100, 'H');

    this.drawAreaFun(600, 100, 'rgba(255, 0, 204, 0.3)');
    this.drawAreaTitle(600, 100, 'G');
    this.drawDanger(600, 100);

    this.drawAreaFun(700, 200, 'rgba(0, 234, 255, 0.3)');
    this.drawAreaTitle(700, 200, 'L', 'x');

    this.drawAreaFun(900, 200, 'rgba(0, 255, 6, 0.3)');
    this.drawAreaTitle(900, 200, 'Z');
  }

  // hello
  drawAreaTitle(startX, width, upperText, lowerText = null) {
    const Y = 40;
    const { ctx, ratio } = this;
    ctx.fillStyle = '#fff';
    const centerX = startX + width / 2;
    ctx.font = `900 ${18 * ratio}px Arial`;
    const long = lowerText ? 30 : 20;
    ctx.fillText(
      lowerText ? upperText : `${upperText}区`,
      (centerX - long) * ratio,
      Y * ratio,
    );
    if (lowerText) {
      ctx.fillText('区', (centerX - 10) * ratio, Y * ratio);
      ctx.font = `400 ${16 * ratio}px Arial`;
      // ctx.textBaseline = 'bottom';
      ctx.fillText(lowerText, (centerX - 18) * ratio, Y * ratio);
    }
    ctx.restore();
  }

  // 绘制危险区
  drawDanger(startX, width) {
    const { ctx, ratio } = this;
    const Y = 102;
    ctx.lineWidth = 1 * ratio;
    this.drawAreaFun(startX + 4, width - 8, '#000', Y - 24, 38, true);
    this.drawAreaFun(startX + 8, width - 16, 'rgba(223, 6, 27, 1)', Y - 20, 30);

    ctx.fillStyle = '#fff';
    ctx.font = `900 ${18 * ratio}px Arial`;
    const centerX = startX + width / 2;
    ctx.textBaseline = 'center';
    ctx.fillText('作业区', (centerX - 28) * ratio, Y * ratio);
  }

  // 绘制 开始点、宽度、颜色
  drawAreaFun(
    startX,
    width,
    color,
    selfY = null,
    selfHeight = null,
    isStroke = false,
  ) {
    const Y = selfY || 3;
    const height = selfHeight || 200 - 6;
    const { ctx, ratio } = this;
    if (isStroke) {
      ctx.strokeStyle = color;
      ctx.strokeRect(startX * ratio, Y * ratio, width * ratio, height * ratio);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(startX * ratio, Y * ratio, width * ratio, height * ratio);
    }
    ctx.restore();
  }

  // 绘制线段
  drawLine(from, to, ctx, dash = []) {
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }
}
