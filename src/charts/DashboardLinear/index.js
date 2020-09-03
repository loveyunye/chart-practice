import { deepMerge } from '../../utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';
/**
 * 渐变仪表盘
 */
class LinearDashboard {
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, LinearDashboard.defaultOptions, options);
    this.svg = null;
    this.paramsConversion();
  }

  static defaultOptions = {
    globalConfig: {
      startAngle: 135,
      endAngle: 45,
      radius: 160,
      min: 0,
      max: 100,
    },
    axis: {
      width: 24,
      color: [
        { offset: 0, color: 'rgba(38, 211, 166, 1)' },
        { offset: 0.333, color: 'rgba(38, 211, 166, 1)' },
        { offset: 0.666, color: 'rgba(24, 179, 254, 1)' },
        { offset: 1, color: 'rgba(255, 54, 162, 1)' },
      ],
    },
    dividingLine: {
      number: 6,
      length: 8,
      width: 1,
      color: '#ffffff',
      distance: 6,
      show: true,
    },
    tickLine: { number: 10, length: 8, width: 1, color: '#ffffff', show: true },
    point: {
      length: 140,
      width: 12,
      center: 0.1,
      color: '#FFED8B',
      show: true,
    },
    outerArc: {
      width: 2,
      distance: 20,
      color: [
        { offset: 0, color: 'rgba(255,255,255,0)' },
        { offset: 1, color: '#0CD7F0' },
      ],
      show: true,
    },
    innerCircle: { radius: 80, color: 'rgba(110,182,255,0.22)', show: true },
    innerArc: { radius: 20, width: 4, color: '#3BAFFB', show: true },
    text: {
      fontSize: 30,
      fontWight: 500,
      color: '#ffffff',
      decimalPlaces: 1,
      dy: 120,
      show: false,
    },
    animateTime: 2000,
  };

  // 参数转换
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
    this.arcG = this.containerG.append('g').attr('class', 'arc-g');
    this.dividingLineG = this.containerG
      .append('g')
      .attr('class', 'dividing-line');
    this.tickLineG = this.containerG.append('g').attr('class', 'tick-line');
    this.drawBase();
  }

  // 绘制基本图形
  drawBase() {
    const {
      point,
      dividingLine,
      tickLine,
      axis,
      outerArc,
      innerCircle,
      innerArc,
    } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG.attr('transform', `translate(${width / 2}, ${height / 2})`);

    const { startAngle, endAngle, radius } = this;

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

    // 外圈渐变
    this.linearOuterID = `linearGradientID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;
    this.containerG
      .append('defs')
      .append('linearGradient')
      .attr('id', this.linearOuterID)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 1)
      .selectAll('stop')
      .data(outerArc.color)
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // 绘制背景环
    const innerRadius = radius - axis.width;
    this.arc = d3Arc()
      .outerRadius(radius)
      .innerRadius(innerRadius);
    this.arcG.select('.bg-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'bg-arc')
      .attr(
        'd',
        this.arc({
          startAngle: (startAngle - 0.02) * Math.PI,
          endAngle: (endAngle + 0.02) * Math.PI,
        }),
      )
      .attr('fill', `url(#${this.linearGradientID})`);

    // 创建尺子
    const scaleDividing = scaleLinear()
      .domain([0, dividingLine.number - 1])
      .range([(startAngle - 0.5) * Math.PI, (endAngle - 0.5) * Math.PI]);

    const tickL = innerRadius + dividingLine.distance;
    // 分割线
    this.dividingLineG.selectAll('line').remove();
    this.dividingLineG
      .selectAll('line')
      .data(Array.from(new Array(dividingLine.number)))
      .enter()
      .append('line')
      .attr('x1', (d, i) => tickL * Math.cos(scaleDividing(i)))
      .attr(
        'x2',
        (d, i) => (tickL + dividingLine.length) * Math.cos(scaleDividing(i)),
      )
      .attr('y1', (d, i) => tickL * Math.sin(scaleDividing(i)))
      .attr(
        'y2',
        (d, i) => (tickL + dividingLine.length) * Math.sin(scaleDividing(i)),
      )
      .style('display', `${dividingLine.show ? 'block' : 'none'}`)
      .attr('stroke', dividingLine.color)
      .attr('stroke-width', dividingLine.width);

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
      .attr('x1', (d, i) => tickL * Math.cos(scaleTickLine(i)))
      .attr(
        'x2',
        (d, i) => (tickL + tickLine.length) * Math.cos(scaleTickLine(i)),
      )
      .attr('y1', (d, i) => tickL * Math.sin(scaleTickLine(i)))
      .attr(
        'y2',
        (d, i) => (tickL + tickLine.length) * Math.sin(scaleTickLine(i)),
      )
      .style('display', `${tickLine.show ? 'block' : 'none'}`)
      .attr('stroke', tickLine.color)
      .attr('stroke-width', tickLine.width);

    // 外环
    this.outer = d3Arc()
      .outerRadius(radius + outerArc.distance)
      .innerRadius(radius + outerArc.distance - outerArc.width);
    // 内圈
    this.innerCircle = d3Arc()
      .outerRadius(0)
      .innerRadius(innerCircle.radius);
    // 内圆
    this.innerArc = d3Arc()
      .outerRadius(innerArc.radius)
      .innerRadius(innerArc.radius + innerArc.width);

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
  }

  // 绘制动画图形
  drawAnimate() {
    const { text, animateTime, outerArc, innerCircle, innerArc } = this.options;
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
    // 外环
    this.arcG.select('.outer-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'outer-arc')
      .attr('fill', `url(#${this.linearOuterID})`)
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

    // 内圆
    this.arcG.select('.inner-circle').remove();
    this.arcG
      .append('path')
      .attr('class', 'inner-circle')
      .attr('fill', innerCircle.color)
      .style('display', `${innerCircle.show ? 'block' : 'none'}`)
      .transition()
      .duration(animateTime)
      .attrTween('d', function() {
        const linearData = scaleLinear().range([0, 2]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.innerCircle({
            startAngle: 0,
            endAngle: angle * Math.PI,
          });
        };
      });
    // 内圈
    this.arcG.select('.inner-arc').remove();
    this.arcG
      .append('path')
      .attr('class', 'inner-arc')
      .attr('fill', innerArc.color)
      .style('display', `${innerArc.show ? 'block' : 'none'}`)
      .transition()
      .duration(animateTime)
      .attrTween('d', function() {
        const linearData = scaleLinear().range([0, 2]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.innerArc({
            startAngle: 0,
            endAngle: angle * Math.PI,
          });
        };
      });
    // 增加text
    let textValue = 0;
    this.containerG.select('.value').remove();
    if (text.show) {
      this.containerG
        .append('text')
        .attr('class', 'value')
        .attr('fill', text.color)
        .attr('font-size', text.fontSize)
        .attr('dy', text.dy)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'auto')
        .style('font-weight', text.fontWeight)
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

export default LinearDashboard;
