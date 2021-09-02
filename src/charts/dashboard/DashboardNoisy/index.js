import { deepMerge } from '@/utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';
/**
 * 仪表盘
 */
class NoisyDashboard {
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, NoisyDashboard.defaultOptions, options);
    this.svg = null;
    this.paramsConversion();
  }

  static defaultOptions = {
    globalConfig: {
      startAngle: 135,
      endAngle: 45,
      radius: 160,
      min: 0,
      max: 120,
    },
    axis: {
      width: 20,
      color: [
        { offset: 0, color: '#5CF9FE' },
        { offset: 0.17, color: '#468EFD' },
        { offset: 0.9, color: '#468EFD' },
        { offset: 1, color: '#5CF9FE' },
      ],
    },
    dividingLine: {
      number: 7,
      length: 10,
      width: 1,
      color: '#3BAFFB',
      distance: 6,
      show: true,
    },
    tickText: {
      fontSize: 14,
      color: '#ffffff',
      fontWeight: 500,
      distance: 4,
      show: true,
    },
    point: {
      length: 120,
      width: 16,
      center: 0.2,
      color: '#468EFD',
      show: true,
    },
    outerArc: { width: 1, color: '#ffffff', distance: 12, show: true },
    innerArc: { width: 2, color: '#3BAFFB', distance: 16, show: true },
    outerCircle: { radius: 200, color: '#141C33', show: true },
    innerCircle: {
      radius: 75,
      color: [
        { offset: 0, color: '#4978EC' },
        { offset: 0.6, color: '#1E2B57' },
        { offset: 1, color: '#141F3D' },
      ],
      show: true,
    },
    text: {
      value: 'dB',
      fontSize: 50,
      fontWight: 600,
      color: '#ffffff',
      dy: 135,
    },
    animateTime: 2000,
  };

  // 参数转换
  paramsConversion() {
    const { startAngle, endAngle, radius } = this.options.globalConfig;
    let difference;
    if (endAngle <= startAngle) {
      difference = 360 - startAngle + endAngle;
    } else {
      difference = endAngle - startAngle;
    }
    this.startAngle =
      startAngle >= 90 && startAngle <= 270
        ? (startAngle - 270) / 180
        : (90 + startAngle) / 180;
    this.endAngle = this.startAngle + difference / 180;
    this.radius = radius;
  }

  // 初始化
  initChart() {
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
    this.containerG = this.svg.append('g');
    this.circleG = this.containerG.append('g').attr('class', 'circle-g');
    this.dividingLineG = this.containerG
      .append('g')
      .attr('class', 'dividing-line');
    this.dividingTextG = this.containerG
      .append('g')
      .attr('class', 'dividing-text');
    this.tickLineG = this.containerG.append('g').attr('class', 'tick-line');
    this.arcG = this.containerG.append('g').attr('class', 'arc-g');
    this.textG = this.containerG.append('g').attr('class', 'text-g');
    this.drawBase();
  }

  // 绘制基本图形
  drawBase() {
    const {
      point,
      dividingLine,
      tickText,
      text,
      axis,
      outerArc,
      innerArc,
      globalConfig,
      innerCircle,
    } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG.attr('transform', `translate(${width / 2}, ${height / 2})`);

    const { startAngle, endAngle, radius } = this;
    const innerRadius =
      radius - axis.width - innerArc.distance - innerArc.width;

    // 创建尺子
    const scaleDividing = scaleLinear()
      .domain([0, dividingLine.number - 1])
      .range([(startAngle - 0.5) * Math.PI, (endAngle - 0.5) * Math.PI]);

    // 分割线
    this.dividingLineG.selectAll('line').remove();
    this.dividingLineG
      .selectAll('line')
      .data(Array.from(new Array(dividingLine.number)))
      .enter()
      .append('line')
      .attr('x1', (d, i) => innerRadius * Math.cos(scaleDividing(i)))
      .attr(
        'x2',
        (d, i) =>
          (innerRadius - dividingLine.length) * Math.cos(scaleDividing(i)),
      )
      .attr('y1', (d, i) => innerRadius * Math.sin(scaleDividing(i)))
      .attr(
        'y2',
        (d, i) =>
          (innerRadius - dividingLine.length) * Math.sin(scaleDividing(i)),
      )
      .style('display', `${dividingLine.show ? 'block' : 'none'}`)
      .attr('stroke', dividingLine.color)
      .attr('stroke-width', dividingLine.width);

    // 刻度标签
    const { min, max } = globalConfig;
    this.dividingLineG.selectAll('text').remove();
    this.dividingLineG
      .selectAll('text')
      .data(Array.from(new Array(dividingLine.number)))
      .enter()
      .append('text')
      .attr(
        'x',
        (d, i) =>
          (innerRadius -
            tickText.fontSize -
            tickText.distance -
            dividingLine.length) *
          Math.cos(scaleDividing(i)),
      )
      .attr(
        'y',
        (d, i) =>
          (innerRadius -
            tickText.fontSize -
            tickText.distance -
            dividingLine.length) *
          Math.sin(scaleDividing(i)),
      )
      .text((d, i) => {
        return min + ((max - min) / (dividingLine.number - 1)) * i;
      })
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('display', `${tickText.show ? 'block' : 'none'}`)
      .style('font-size', tickText.fontSize)
      .style('font-weight', tickText.fontWeight)
      .attr('fill', tickText.color);

    // 环形渐变
    this.linearGradientID = `linearGradientID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;
    this.containerG
      .append('defs')
      .append('linearGradient')
      .attr('id', this.linearGradientID)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 1)
      .selectAll('stop')
      .data(axis.color)
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // 径向渐变
    this.radialGradientID = `linearGradientID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;
    this.containerG
      .append('defs')
      .append('radialGradient')
      .attr('id', this.radialGradientID)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 1)
      .selectAll('stop')
      .data(innerCircle.color)
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // 绘制背景环
    this.arc = d3Arc()
      .outerRadius(radius)
      .innerRadius(radius - axis.width);
    this.arcG.select('.bg-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'bg-arc')
      .attr(
        'd',
        this.arc({
          startAngle: startAngle * Math.PI,
          endAngle: endAngle * Math.PI,
        }),
      )
      .attr('fill', `url(#${this.linearGradientID})`);

    // 外环、内环
    const outer = d3Arc()
      .outerRadius(radius + outerArc.distance)
      .innerRadius(radius + outerArc.distance + outerArc.width);
    const inner = d3Arc()
      .outerRadius(innerRadius)
      .innerRadius(innerRadius + innerArc.width);

    // 内环
    this.arcG.select('.inner-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'inner-arc')
      .attr('fill', innerArc.color)
      .style('display', `${innerArc.show ? 'block' : 'none'}`)
      .attr(
        'd',
        inner({
          startAngle: startAngle * Math.PI,
          endAngle: endAngle * Math.PI,
        }),
      );
    // 外环
    this.arcG.select('.outer-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'outer-arc')
      .attr(
        'd',
        outer({
          startAngle: startAngle * Math.PI,
          endAngle: endAngle * Math.PI,
        }),
      )
      .style('display', `${outerArc.show ? 'block' : 'none'}`)
      .attr('fill', outerArc.color);

    // 绘制指针
    this.containerG.select('polygon').remove();
    this.pointLine = this.containerG
      .append('polygon')
      .attr('points', () => {
        const x1 = point.length * (1 - point.center);
        const x2 = point.length - x1;
        const y = point.width / 2;
        return `0,${y} ${x1},0 0,${-y} ${-x2},${0}`;
      })
      .style('display', `${point.show ? 'block' : 'none'}`)
      .attr('fill', point.color)
      .attr('transform', 'rotate(-180)');

    // 增加text
    this.containerG.select('.label').remove();
    this.containerG
      .append('text')
      .attr('class', 'label')
      .attr('fill', text.color)
      .attr('font-size', text.fontSize)
      .attr('dy', text.dy)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'auto')
      .style('font-weight', text.fontWeight)
      .text(text.value);
  }

  // 绘制动画图形
  drawAnimate() {
    const { animateTime, outerCircle, innerCircle } = this.options;
    const { startAngle, endAngle } = this;
    // const _self = this;
    // 指针
    this.pointLine
      .attr('transform', `rotate(${(startAngle - 0.5) * 180})`)
      .transition()
      .duration(animateTime)
      .attrTween('transform', () => {
        return (t) => {
          const scaleRotate = scaleLinear()
            .domain([0, 1])
            .range([0, this.data]);
          return `rotate(${(startAngle - 0.5) * 180 +
            (endAngle - startAngle) * 180 * scaleRotate(t)})`;
        };
      });
    // 增加外圆
    this.circleG.select('.outer').remove();
    this.circleG
      .append('circle')
      .attr('class', 'outer')
      .attr('fill', outerCircle.color)
      .style('display', `${outerCircle.show ? 'block' : 'none'}`)
      .attr('r', 0)
      .transition()
      .duration(animateTime)
      .attr('r', outerCircle.radius);
    // 增加内圆
    this.circleG.select('.inner').remove();
    this.circleG
      .append('circle')
      .attr('class', 'inner')
      .attr('fill', `url(#${this.radialGradientID})`)
      .style('display', `${innerCircle.show ? 'block' : 'none'}`)
      .attr('r', 0)
      .transition()
      .duration(animateTime)
      .attr('r', innerCircle.radius);
  }

  // 更新数据
  updateData(data) {
    if (!isNaN(Number(data[0].value))) {
      this.data = Number(data[0].value);
      this.drawAnimate();
    }
  }

  // 更新view
  updateView() {
    const { container } = this;
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      this.initChart();
      this.drawAnimate();
    }
  }

  // 更新数据
  setData(data) {
    if (!isNaN(Number(data))) {
      this.data = Number(data);
      this.drawAnimate();
    }
  }
  // 更新参数
  updateOptions(options) {
    this.options = deepMerge({}, this.options, options);
    this.paramsConversion();
    this.drawBase();
    this.drawAnimate();
  }

  render(data) {
    this.initChart();
    this.updateData(data);
  }

  // 销毁组件
  destroy() {}
}

export default NoisyDashboard;
