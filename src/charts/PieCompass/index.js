import { deepMerge } from '../../utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';

class PieCompass {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOptions, option);
    this.svg = null;
  }

  static defaultOptions = {
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
      fontSize: 50,
      fontWight: 500,
    },
    arcConfig: {
      outerRadius: 100,
      innerRadius: 90,
      cornerRadius: 5,
      bgColor: '#626778',
      valueColor: '#00E8FF',
    },
    point: {
      ballColor: 'rgba(60, 230, 247, 0.2)',
      ballRadius: 8,
      pointLength: 60,
      pointWidth: 4,
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
    this.drawPie();
    // this.drawArc();
  }

  addLine() {}

  drawPie() {
    const { lineConfig, grid, text, point } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 半径
    const radius =
      width > height
        ? (height - grid.top - grid.bottom) / 2
        : (width - grid.left - grid.right) / 2;
    this.radius = radius;
    // 创建尺子
    const scaleAngle = scaleLinear()
      .domain([0, lineConfig.number - 1])
      .range([-1.25 * Math.PI, 0.25 * Math.PI]);
    const scaleColor = scaleLinear()
      .domain([0, lineConfig.number - 1])
      .range(lineConfig.color);

    this.clipPathID = `clipPathID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;

    // 背景线
    this.containerG
      .append('g')
      .attr('class', 'line-items')
      .selectAll('line')
      .data(Array.from(new Array(lineConfig.number)))
      .enter()
      .append('line')
      .attr('x1', (d, i) => radius * Math.cos(scaleAngle(i)))
      .attr(
        'x2',
        (d, i) => (radius - lineConfig.length) * Math.cos(scaleAngle(i)),
      )
      .attr('y1', (d, i) => radius * Math.sin(scaleAngle(i)))
      .attr(
        'y2',
        (d, i) => (radius - lineConfig.length) * Math.sin(scaleAngle(i)),
      )
      .attr('stroke', lineConfig.bgColor)
      .attr('stroke-width', lineConfig.width);
    // 样式线
    this.containerG
      .append('g')
      .attr('class', 'line-items')
      .selectAll('line')
      .data(Array.from(new Array(lineConfig.number)))
      .enter()
      .append('line')
      .attr('x1', (d, i) => radius * Math.cos(scaleAngle(i)))
      .attr(
        'x2',
        (d, i) => (radius - lineConfig.length) * Math.cos(scaleAngle(i)),
      )
      .attr('y1', (d, i) => radius * Math.sin(scaleAngle(i)))
      .attr(
        'y2',
        (d, i) => (radius - lineConfig.length) * Math.sin(scaleAngle(i)),
      )
      .attr('stroke', (d, i) => scaleColor(i))
      .attr('stroke-width', lineConfig.width)
      .attr('clip-path', `url(#${this.clipPathID})`);

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
          startAngle: -0.75 * Math.PI,
          endAngle: 0.75 * Math.PI,
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
    this.pointLine = this.containerG
      .append('polygon')
      .attr('points', () => {
        const x = point.pointLength;
        const y = point.pointWidth / 2;
        return `0,${y} 0,${-y} ${x},0`;
      })
      .attr('fill', point.pointColor)
      .attr('transform', 'rotate(-225)');
  }

  drawArc() {
    const { lineConfig, arcConfig, text, animateTime } = this.options;
    const _self = this;
    // clip 圆环
    const arcClip = d3Arc()
      .outerRadius(this.radius)
      .innerRadius(this.radius - lineConfig.length);

    // 指针
    this.pointLine
      .attr('transform', 'rotate(-225)')
      .transition()
      .duration(animateTime)
      .attrTween('transform', () => {
        return (t) => {
          const scaleRotate = scaleLinear()
            .domain([0, 1])
            .range([0, this.data]);
          return `rotate(${-225 + 270 * scaleRotate(t)})`;
        };
      });

    // 增加clip path
    this.containerG.select('.clip-path').remove();
    this.containerG
      .append('clipPath')
      .attr('id', this.clipPathID)
      .attr('class', 'clip-path')
      .append('path')
      .transition()
      .duration(animateTime)
      .attrTween('d', function() {
        const linearData = scaleLinear().range([
          -0.75,
          1.5 * _self.data - 0.75,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return arcClip({
            startAngle: -0.75 * Math.PI,
            endAngle: angle * Math.PI,
          });
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
          -0.75,
          1.5 * _self.data - 0.75,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.arc({
            startAngle: -0.75 * Math.PI,
            endAngle: angle * Math.PI,
          });
        };
      });

    // 增加text
    let textValue = 0;
    this.containerG.selectAll('text').remove();
    this.containerG
      .append('text')
      .attr('fill', `url(#${this.linearGradientID})`)
      .attr('font-size', text.fontSize)
      .attr('dy', this.radius - text.fontSize)
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
