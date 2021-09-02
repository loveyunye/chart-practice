import { deepMerge } from '@/utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';
class PieCompass {
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOptions, options);
    this.svg = null;
    this.paramsConversion();
  }

  static defaultOptions = {
    globalConfig: {
      startAngle: 180,
      endAngle: 0,
      radius: 160,
      min: 0,
      max: 100,
    },
    axis: {
      width: 50,
      color: [
        { offset: 0, color: '#32E0B4' },
        { offset: 1, color: '#3BAFFB' },
      ],
      bgColor: '#626778',
    },
    dividingLine: {
      number: 6,
      length: 16,
      width: 1,
      color: '#3BAFFB',
      distance: 6,
      show: true,
    },
    tickText: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.4)',
      fontWeight: 500,
      distance: 4,
      show: true,
    },
    tickLine: { number: 5, length: 10, width: 1, color: '#3BAFFB', show: true },
    point: { width: 4, color: '#ffffff', show: true },
    outerArc: { width: 2, color: '#3BAFFB', distance: 0, show: true },
    innerArc: { width: 1, color: '#3BAFFB', distance: 8, show: true },
    text: {
      fontSize: 30,
      fontWight: 500,
      color: '#ffffff',
      decimalPlaces: 1,
      dy: 0,
    },
    animateTime: 2000,
  };

  paramsConversion() {
    const { startAngle, endAngle, radius } = this.options.globalConfig;
    let difference;
    if (endAngle < startAngle) {
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
      tickLine,
      tickText,
      axis,
      outerArc,
      innerArc,
      globalConfig,
    } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG.attr('transform', `translate(${width / 2}, ${height / 2})`);

    const { startAngle, endAngle, radius } = this;

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
      .attr('x1', (d, i) => radius * Math.cos(scaleDividing(i)))
      .attr(
        'x2',
        (d, i) => (radius - dividingLine.length) * Math.cos(scaleDividing(i)),
      )
      .attr('y1', (d, i) => radius * Math.sin(scaleDividing(i)))
      .attr(
        'y2',
        (d, i) => (radius - dividingLine.length) * Math.sin(scaleDividing(i)),
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
          (radius + tickText.fontSize / 2 + tickText.distance) *
          Math.cos(scaleDividing(i)),
      )
      .attr(
        'y',
        (d, i) =>
          (radius + tickText.fontSize / 2 + tickText.distance) *
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

    // 刻度线
    const scaleTickLine = scaleLinear()
      .domain([0, tickLine.number * (dividingLine.number - 1)])
      .range([(startAngle - 0.5) * Math.PI, (endAngle - 0.5) * Math.PI]);
    this.tickLineG.selectAll('line').remove();
    this.tickLineG
      .selectAll('line')
      .data(
        Array.from(new Array(tickLine.number * (dividingLine.number - 1) + 1)),
      )
      .enter()
      .append('line')
      .attr('x1', (d, i) => radius * Math.cos(scaleTickLine(i)))
      .attr(
        'x2',
        (d, i) => (radius - tickLine.length) * Math.cos(scaleTickLine(i)),
      )
      .attr('y1', (d, i) => radius * Math.sin(scaleTickLine(i)))
      .attr(
        'y2',
        (d, i) => (radius - tickLine.length) * Math.sin(scaleTickLine(i)),
      )
      .style('display', `${tickLine.show ? 'block' : 'none'}`)
      .attr('stroke', tickLine.color)
      .attr('stroke-width', tickLine.width);

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

    // 绘制背景环
    const outerRadius = radius - dividingLine.length - dividingLine.distance;
    const innerRadius =
      radius - dividingLine.length - dividingLine.distance - axis.width;
    this.arc = d3Arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);
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
      .attr('fill', axis.bgColor);

    // 外环、内环
    this.outer = d3Arc()
      .outerRadius(radius + outerArc.distance)
      .innerRadius(radius + outerArc.distance - outerArc.width);
    const inner = d3Arc()
      .outerRadius(innerRadius - innerArc.distance)
      .innerRadius(innerRadius - innerArc.distance - innerArc.width);
    this.arcG.select('.inner-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'inner-arc')
      .attr(
        'd',
        inner({
          startAngle: startAngle * Math.PI,
          endAngle: endAngle * Math.PI,
        }),
      )
      .style('display', `${innerArc.show ? 'block' : 'none'}`)
      .attr('fill', innerArc.color);

    // 绘制指针
    this.containerG.select('polygon').remove();
    this.pointLine = this.containerG
      .append('polygon')
      .attr('points', () => {
        const x = radius;
        const x2 = innerArc.show
          ? innerRadius - innerArc.distance
          : innerRadius;
        const y = point.width / 2;
        return `${x2},${y} ${x2},${-y} ${x},0`;
      })
      .style('display', `${point.show ? 'block' : 'none'}`)
      .attr('fill', point.color)
      .attr('transform', 'rotate(-180)');
  }

  // 绘制动画图形
  drawAnimate() {
    const { text, animateTime, outerArc } = this.options;
    const { startAngle, endAngle } = this;
    const _self = this;
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
    // 增加value path
    this.arcG.select('.value-path').remove();
    this.arcG
      .append('path')
      .attr('class', 'value-path')
      .attr('fill', `url(#${this.linearGradientID})`)
      .transition()
      .duration(animateTime)
      .attrTween('d', function() {
        const linearData = scaleLinear().range([
          startAngle,
          (endAngle - startAngle) * _self.data + startAngle,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.arc({
            startAngle: startAngle * Math.PI,
            endAngle: angle * Math.PI,
          });
        };
      });
    // 外环
    this.arcG.select('.outer-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'outer-arc')
      .attr('fill', outerArc.color)
      .style('display', `${outerArc.show ? 'block' : 'none'}`)
      .transition()
      .duration(animateTime)
      .attrTween('d', function() {
        const linearData = scaleLinear().range([
          startAngle,
          (endAngle - startAngle) * _self.data + startAngle,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.outer({
            startAngle: startAngle * Math.PI,
            endAngle: angle * Math.PI,
          });
        };
      });

    // 增加text
    let textValue = 0;
    this.containerG.select('.value').remove();
    this.containerG
      .append('text')
      .attr('class', 'value')
      .attr('fill', text.color)
      .attr('font-size', text.fontSize)
      .attr('dy', text.dy)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'auto')
      .style('font-weight', text.fontWeight)
      .style('display', `${outerArc.show ? 'block' : 'none'}`)
      .transition()
      .duration(animateTime)
      .tween('text', () => {
        const linearData = scaleLinear().range([textValue, this.data]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return function(t) {
          textValue = linearData(t);
          this.textContent = `${(linearAngle(textValue) * 100).toFixed(
            text.decimalPlaces,
          )}%`;
        };
      });
  }

  // 更新数据
  setData(data) {
    if (!isNaN(Number(data))) {
      this.data = Number(data);
      this.drawAnimate();
    }
  }

  // 更新view
  updateView() {
    if (this.chart) {
      this.chart.drawBase();
      this.chart.drawAnimate();
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
}

export default PieCompass;
