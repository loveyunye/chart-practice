import arrow from './arrow.png';
import warning from './warning.png';
import { debounce } from '@/utils';

export default class Way {
  constructor(canvas) {
    this.canvas = canvas;
    this.ratio = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.imgContainer = {};
    this.imgInit = false;

    this.initHandler(); // 初始化；

    this.dots = [
      { id: 'aaa', x: 10, y: 10, isNormal: true },
      { id: 'bbb', x: 60, y: 10, isNormal: false },
      { id: 'bbb', x: 100, y: 100, isNormal: false },
      { id: 'bbb', x: 100, y: 60, isNormal: false },
    ];
    this.signs = [
      { id: 'ccc', x: 60, y: 10, isNormal: true, number: 100 },
      { id: 'bbb', x: 120, y: 10, isNormal: true, number: 80 },
      { id: 'bbb', x: 180, y: 10, isNormal: true, number: 60 },
    ];
    // 规则
    this.regulation = {
      S: {
        long: 400,
        dots: [],
      },
      Ls: {
        long: 100,
        dots: [],
      },
      H: {
        long: 100,
        dots: [],
      },
      G: {
        long: 100,
        dots: [],
      },
      Lx: {
        long: 200,
        dots: [],
      },
      Z: {
        long: 200,
        dots: [],
      },
    };

    this.mousemove = debounce(this.mousemoveHandler, 10);
    this.canvas.addEventListener('mousemove', (e) => {
      this.mousemove(e);
    });
    this.canvas.addEventListener('click', (e) => {
      this.clickHandler(e);
    });
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

    this.wayHeight = Math.ceil((height - 3 * 2 - 14) / 3); // 路的宽度
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
  }

  // over 事件
  mousemoveHandler(e) {
    const { canvas } = this;
    const { clientX, clientY } = e;
    const { left, top } = canvas.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    this.dots = this.dots.map((i) => {
      const isHover = Math.abs(i.x - x) <= 3 && Math.abs(i.y - y) <= 3;
      return {
        ...i,
        isHover,
      };
    });

    this.signs = this.signs.map((i) => {
      const isHover = Math.abs(i.x - x) <= 9 && Math.abs(i.y - y) <= 9;
      return {
        ...i,
        isHover,
      };
    });

    this.canvas.style.cursor =
      this.dots.some((i) => !!i.isHover) || this.signs.some((i) => !!i.isHover)
        ? 'pointer'
        : 'inherit';
    this.draw();
  }

  // 点击事件
  clickHandler(e) {
    const { canvas } = this;
    const { clientX, clientY } = e;
    const { left, top } = canvas.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const dot = this.dots.find((i) => {
      const isHover = Math.abs(i.x - x) <= 3 && Math.abs(i.y - y) <= 3;
      return isHover;
    });
    const sign = this.signs.find((i) => {
      const isHover = Math.abs(i.x - x) <= 9 && Math.abs(i.y - y) <= 9;
      return isHover;
    });
    console.log(dot, sign);
  }

  async draw() {
    if (!this.ctx) {
      return false;
    }
    await this.getImgObj();
    const { width, height, ratio, ctx } = this;
    ctx.clearRect(0, 0, width * ratio, height * ratio);
    // 设置像素比例
    this.drawMain();
    this.drawArea();
    this.drawSign();
    this.drawDot();
  }

  // 获取图片
  async getImgObj() {
    if (!this.imgInit) {
      await this.setImgItem('arrow', arrow);
      await this.setImgItem('warning', warning);
      this.imgInit = true;
    }
  }

  // 设置单个图片
  setImgItem(key, img) {
    return new Promise((resolve) => {
      if (this.imgContainer[key]) {
        resolve();
      } else {
        const imgObj = new Image();
        imgObj.src = img;
        //待图片加载完后，将其显示在canvas上
        imgObj.onload = () => {
          this.imgContainer[key] = imgObj;
          resolve();
        };
      }
    });
  }

  // 绘制主要线段
  drawMain() {
    const { ratio, ctx, width, height, wayHeight, imgContainer } = this;
    ctx.strokeStyle = '#4199EA';
    ctx.lineWidth = ratio * 3;

    // 绘制分割线
    this.drawLine(
      {
        x: 0,
        y: 3 / 2,
      },
      {
        x: width,
        y: 3 / 2,
      },
    );
    this.drawLine(
      {
        x: 0,
        y: height - 3 / 2,
      },
      {
        x: width,
        y: height - 3 / 2,
      },
    );

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = ratio * 7;
    this.drawLine(
      {
        x: 0,
        y: height - (wayHeight + 3 + 7 / 2),
      },
      {
        x: width * ratio,
        y: height - (wayHeight + 3 + 7 / 2),
      },
    );

    this.drawLine(
      {
        x: 0,
        y: wayHeight + 3 + 7 / 2,
      },
      {
        x: width * ratio,
        y: wayHeight + 3 + 7 / 2,
      },
      [200, 160],
    );

    //待图片加载完后，将其显示在canvas上
    //ctx.drawImage(img, 0, 0,1024,768);//改变图片的大小到1024*768
    const firstHeight = 3 + wayHeight / 2; // 1车道高度
    const twoHeight = 3 + wayHeight + 7 + wayHeight / 2; // 2车道高度
    const imgNumber = Math.floor((width * ratio) / 200);
    [firstHeight, twoHeight].forEach((height) => {
      Array(imgNumber)
        .fill(height)
        .forEach((i, index) => {
          ctx.drawImage(
            imgContainer['arrow'],
            50 + index * 160 * ratio,
            (i - 6) * ratio,
            50 * ratio,
            12 * ratio,
          );
        });
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

  // 绘制区域标题
  drawAreaTitle(startX, width, upperText, lowerText = null) {
    const Y = 36;
    const { ctx, ratio } = this;
    ctx.fillStyle = '#fff';
    const centerX = startX + width / 2;
    ctx.font = `900 ${18 * ratio}px Arial`;
    const long = lowerText ? 30 : 20;
    ctx.textBaseline = 'middle';
    ctx.fillText(
      lowerText ? upperText : `${upperText}区`,
      (centerX - long) * ratio,
      Y * ratio,
    );
    if (lowerText) {
      ctx.fillText('区', (centerX - 10) * ratio, Y * ratio);
      ctx.font = `400 ${16 * ratio}px Arial`;
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
    ctx.textBaseline = 'middle';
    ctx.fillText('作业区', (centerX - 28) * ratio, (Y - 4) * ratio);
  }

  // 绘制标示牌
  drawSign() {
    const { wayHeight, height } = this;
    const Y = height - wayHeight / 2 - 3;
    this.signs = this.signs.map((i) =>
      this.drawSignFun({
        ...i,
        y: Y,
      }),
    );
  }

  // 绘制点
  drawDot() {
    this.dots.forEach((i) => {
      this.drawDotFun(i.x, i.y, i.isNormal, i.isHover);
    });
  }

  drawDotId(id, ...args) {
    return { id, ...this.drawDotFun(...args) };
  }

  // 绘制点-锥桶
  drawDotFun(x, y, isNormal = true, isHover = false) {
    const { ctx, ratio, height } = this;

    const radius = isHover ? 8 : 6;

    this.drawAreaFun(
      x - radius,
      radius * 2,
      // isNormal ? '#000' : '#ffa500',
      isNormal ? '#000' : '#ffd500',
      y - radius,
      radius * 2,
    );

    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(
      x * ratio,
      y * ratio,
      (isHover ? radius - 2 : radius - 1) * ratio,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(223, 6, 27, 1)';
    ctx.arc(
      x * ratio,
      y * ratio,
      (isHover ? radius - 4 : radius - 3) * ratio,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    ctx.closePath();

    if (isHover) {
      ctx.strokeStyle = '#fff';

      this.drawLine(
        {
          x,
          y: y + 8,
        },
        {
          x,
          y: height,
        },
      );
    }

    return {
      x,
      y,
      radius: 6,
    };
  }

  // 绘制标志牌-method
  drawSignFun({ number, x, y, isNormal = true, isHover = false, id }) {
    const radius = isHover ? 20 : 18;

    const { ctx, ratio, height } = this;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(223, 6, 27, 1)';
    ctx.arc(x * ratio, y * ratio, radius * ratio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(x * ratio, y * ratio, (radius - 3) * ratio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#000';
    ctx.font = `900 ${18 * ratio}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillText(
      number,
      (x - String(number).length * 5) * ratio,
      (y + 1) * ratio,
    );

    if (isNormal) {
      ctx.drawImage(
        this.imgContainer['warning'],
        (x + 10) * ratio,
        (y - 15) * ratio,
        12 * ratio,
        12 * ratio,
      );
    }
    if (isHover) {
      ctx.strokeStyle = '#fff';
      this.drawLine(
        {
          x,
          y: y + 8,
        },
        {
          x,
          y: height,
        },
      );
    }
    return {
      id,
      x,
      y,
      number,
      isNormal,
    };
  }

  // 绘制区域块 开始点、宽度、颜色
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
