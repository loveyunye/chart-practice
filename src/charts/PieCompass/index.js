import { deepMerge } from '../../utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';

class PieCompass {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOption, option);
    this.svg = null;
  }

  static defaultOption = {
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
        { offset: 0, color: '#62C232' },
        { offset: 1, color: '#ffffff' },
      ],
      decimalPlaces: 0, // 小数位数
      fontSize: 50,
      fontWight: 500,
    },
    arcConfig: {
      outerRadius: 100,
      innerRadius: 90,
      cornerRadius: 0,
      bgColor: '#626778',
      valueColor: '#00E8FF',
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
    const { lineConfig, grid, text } = this.options;
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
  }

  drawArc() {
    const { lineConfig, arcConfig, text, animateTime } = this.options;
    const _self = this;
    const arcClip = d3Arc()
      .outerRadius(this.radius)
      .innerRadius(this.radius - lineConfig.length);
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
    this.data = data;
    this.drawArc();
  }
}

export default PieCompass;
