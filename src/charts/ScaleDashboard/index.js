import { deepMerge } from '../../utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';

class PieCompass {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOptions, option);
    this.svg = null;
  }

  static defaultOptions = {
    globalConfig: {
      startAngle: -1,
      endAngle: 0.5,
      radius: 100,
      min: 0,
      max: 100,
    },
    dividingLine: {
      number: 6,
      length: 24,
      width: 2,
      color: '#ffffff',
    },
    tickLine: {
      number: 51,
      length: 10,
      width: 1,
      color: 'rgba(255, 255, 255, 0.4)',
    },
    lineConfig: {
      number: 100,
      length: 16,
      width: 3,
      color: ['#00E8FF', '#57EF65', '#FFCA0F', '#FF0000'],
      bgColor: '#626778',
    },
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    text: {
      color: [
        { offset: 0, color: '#0078FF' },
        { offset: 0.5, color: 'rgba(60, 230, 247, 1)' },
        { offset: 1, color: '#62C232' },
      ],
      decimalPlaces: 0, // 小数位数
      fontSize: 20,
      fontWight: 500,
    },
    arcConfig: {
      outerRadius: 130,
      innerRadius: 110,
      cornerRadius: 0,
      bgColor: '#626778',
      valueColor: '#00E8FF',
    },
    point: {
      ballColor: 'rgba(60, 230, 247, 0.2)',
      ballRadius: 8,
      pointLength: 50,
      pointWidth: 8,
      pointColor: 'rgba(60, 230, 247, 1)',
    },
    animateTime: 2000,
  };

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
    this.drawPie();
  }

  drawPie() {
    const {
      grid,
      text,
      point,
      globalConfig,
      dividingLine,
      tickLine,
    } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG.attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 半径
    let radius =
      width > height
        ? (height - grid.top - grid.bottom) / 2
        : (width - grid.left - grid.right) / 2;
    radius = radius - 40;
    // 分割线
    // 创建尺子
    const scaleDividing = scaleLinear()
      .domain([0, dividingLine.number - 1])
      .range([
        (globalConfig.startAngle - 0.5) * Math.PI,
        (globalConfig.endAngle - 0.5) * Math.PI,
      ]);
    // 背景线
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
      .attr('stroke', dividingLine.color)
      .attr('stroke-width', dividingLine.width);
    // 刻度文字
    this.dividingLineG
      .selectAll('text')
      .data(Array.from(new Array(dividingLine.number)))
      .enter()
      .append('text')
      .attr(
        'x',
        (d, i) =>
          (radius - dividingLine.length - 10) * Math.cos(scaleDividing(i)),
      )
      .attr(
        'y',
        (d, i) =>
          (radius - dividingLine.length - 10) * Math.sin(scaleDividing(i)),
      )
      .text((d, i) => {
        return i * 20;
      })
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('font-size', 10)
      .attr('fill', '#fff');

    // 刻度线
    // 创建尺子
    const scaleTickLine = scaleLinear()
      .domain([0, tickLine.number - 1])
      .range([
        (globalConfig.startAngle - 0.5) * Math.PI,
        (globalConfig.endAngle - 0.5) * Math.PI,
      ]);
    this.tickLineG
      .selectAll('line')
      .data(Array.from(new Array(tickLine.number)))
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
      .attr('stroke', tickLine.color)
      .attr('stroke-width', tickLine.width);

    // 字体渐变
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
      .data(text.color)
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // 绘制背景环
    const { arcConfig } = this.options;
    this.arc = d3Arc()
      .outerRadius(arcConfig.outerRadius)
      .innerRadius(arcConfig.innerRadius)
      .cornerRadius(arcConfig.cornerRadius);
    this.containerG
      .append('path')
      .attr(
        'd',
        this.arc({
          startAngle: globalConfig.startAngle * Math.PI,
          endAngle: globalConfig.endAngle * Math.PI,
        }),
      )
      .attr('fill', arcConfig.bgColor);

    // 绘制指针
    this.containerG
      .append('circle')
      .attr('r', point.ballRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', point.ballColor);
    this.containerG.select('polygon').remove();
    this.pointLine = this.containerG
      .append('polygon')
      .attr('points', () => {
        const x = point.pointLength;
        const y = point.pointWidth / 2;
        return `0,${y} ${-x / 4},0 0,${-y} ${x},0`;
      })
      .attr('fill', point.pointColor)
      .attr('transform', 'rotate(-180)');
  }
  // 圆环
  drawArc() {
    const { arcConfig, text, animateTime, globalConfig } = this.options;
    const { startAngle, endAngle } = globalConfig;
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
    this.containerG.select('.value-path').remove();
    this.containerG
      .append('path')
      .attr('class', 'value-path')
      .attr('fill', arcConfig.valueColor)
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

    // 增加text
    let textValue = 0;
    this.containerG.select('.value').remove();
    this.containerG
      .append('text')
      .attr('class', 'value')
      .attr('fill', `url(#${this.linearGradientID})`)
      .attr('font-size', text.fontSize)
      .attr('dy', text.fontSize * 2)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('font-weight', text.fontWight)
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

  setData(data) {
    this.data = Number(data);
    this.drawArc();
  }
}

export default PieCompass;
