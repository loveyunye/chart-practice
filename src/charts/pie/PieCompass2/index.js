import { deepMerge } from '@/utils';
import { select, scaleLinear, arc as d3Arc } from 'd3';

class PieCompass {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOptions, option);
    this.svg = null;
    this.initChart();
  }

  static defaultOptions = {
    lineConfig: {
      radius: 80,
      number: 30,
      length: 10,
      color: ['#57EF65', '#00E8FF'],
      gapDeg: 2, // 间隔角度
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
      outerRadius: 88,
      innerRadius: 84,
      cornerRadius: 2,
      bgColor: '#626778',
      valueColor: '#00E8FF',
    },
    point: {
      ballColor: 'rgba(60, 230, 247, 0.2)',
      color: [
        {
          opacity: 0,
          color: '#3BAFFB',
          offset: 0,
        },
        {
          opacity: 0.1,
          color: '#3BAFFB',
          offset: 0.6,
        },
        {
          opacity: 0.6,
          color: '#3BAFFB',
          offset: 1,
        },
      ],
      ballRadius: 70,
    },
    animateTime: 2000,
  };

  initChart() {
    if (this.svg) {
      return;
    }
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
    this.drawPie();
    // this.drawArc();
  }

  drawPie() {
    const { lineConfig, text, point } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    this.containerG = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 半径
    const radius = lineConfig.radius;
    this.radius = radius;
    // 创建尺子
    const scaleColor = scaleLinear()
      .domain([0, lineConfig.number - 1])
      .range(lineConfig.color);

    this.clipPathID = `clipPathID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;

    const itemAngle =
      (2 * Math.PI) / lineConfig.number - (lineConfig.gapDeg / 180) * Math.PI;

    // 样式线
    this.containerG
      .append('g')
      .attr('class', 'path-items')
      .selectAll('path')
      .data(Array.from(new Array(lineConfig.number)))
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        console.log(i);
        const arcItem = d3Arc()
          .outerRadius(lineConfig.radius)
          .innerRadius(lineConfig.radius - lineConfig.length);
        return arcItem({
          startAngle: (i * (2 * Math.PI)) / lineConfig.number,
          endAngle: (i * (2 * Math.PI)) / lineConfig.number + itemAngle,
        });
      })
      .attr('fill', (d, i) => scaleColor(i))
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
          startAngle: 0 * Math.PI,
          endAngle: 2 * Math.PI,
        }),
      )
      .attr('fill', arcConfig.bgColor);

    // 径向渐变
    this.radialGradientID = `radialGradientID${Math.random()
      .toFixed(8)
      .replace('0.', '')}`;
    this.containerG
      .append('defs')
      .append('radialGradient')
      .attr('id', this.radialGradientID)
      .selectAll('stop')
      .data(point.color)
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color)
      .attr('stop-opacity', (d) => d.opacity);

    // 绘制指针
    this.containerG
      .append('circle')
      .attr('r', point.ballRadius)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', `url(#${this.radialGradientID})`);
  }

  drawArc() {
    const { lineConfig, arcConfig, text, animateTime } = this.options;
    const _self = this;
    // clip 圆环
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
        const linearData = scaleLinear().range([0, 2 * _self.data]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return arcClip({
            startAngle: 0 * Math.PI,
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
        const linearData = scaleLinear().range([0, 2 * _self.data]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this.currentValue = linearData(t);
          const angle = linearAngle(this.currentValue);
          return _self.arc({
            startAngle: 0 * Math.PI,
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
      .attr('dy', text.dy || 0)
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
