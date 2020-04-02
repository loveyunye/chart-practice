import { deepMerge } from '../../utils';
import { select, scaleLinear } from 'd3';

class PieCompass {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieCompass.defaultOptions, option);
    this.svg = null;
  }

  static defaultOptions = {
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    split: {
      splitValues: [0, 0.2, 0.4, 1],
      splitColor: '#0078FF',
      splitWidth: 2,
      splitLeft: 60, // 距离左侧长度
    },
    text: {
      color: '#62C232',
      fontSize: 20,
      fontWight: 500,
    },
    circle: {
      radius: 6,
    },
    animateTime: 2000,
  };

  initChart() {
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
    this.drawLine();
  }

  drawLine() {
    const { clientWidth, clientHeight } = this.container;
    const { grid, split, text } = this.options;
    const { left, top, bottom, right } = grid;
    const g = this.svg
      .append('g')
      .attr('transform', `translate(${left}, ${top})`);
    const { splitColor, splitWidth, splitLeft } = split;
    let { splitValues } = split;
    splitValues = splitValues.sort((a, b) => b - a);
    const scaleAxisY = scaleLinear()
      .domain([0, splitValues.length - 1])
      .range([0, clientHeight - top - bottom]);

    // 绘制线
    g.append('g')
      .attr('class', 'split')
      .selectAll('line')
      .data(splitValues)
      .enter()
      .append('line')
      .attr('x1', splitLeft)
      .attr('x2', clientWidth - left - right)
      .attr('y1', (d, i) => scaleAxisY(i))
      .attr('y2', (d, i) => scaleAxisY(i))
      .attr('stroke', splitColor)
      .attr('stroke-width', splitWidth);
    g.append('line')
      .attr('x1', splitLeft)
      .attr('x2', splitLeft)
      .attr('y1', 0)
      .attr('y2', clientHeight - top - bottom)
      .attr('stroke', splitColor)
      .attr('stroke-width', splitWidth);

    // 绘制文字
    g.selectAll('text')
      .data(splitValues)
      .enter()
      .append('text')
      .attr('x', 20)
      .attr('y', (d, i) => scaleAxisY(i))
      .text((d, i) => {
        return `${splitValues[i] * 100}%`;
      })
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('font-weight', text.fontWight)
      .style('font-size', text.fontSize)
      .style('fill', text.color);
    this.containerCircles = g.append('g').attr('class', 'circle');
  }

  setData(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.containerCircles.selectAll('g').remove();
      const { grid, split } = this.options;
      const { splitLeft } = split;
      let { splitValues } = split;
      splitValues = splitValues.sort((a, b) => a - b);

      const { radius } = this.options.circle;
      const { clientWidth, clientHeight } = this.container;
      const width = clientWidth - grid.left - grid.right - splitLeft;
      const height = clientHeight - grid.top - grid.bottom;
      const splitAverage = 1 / (splitValues.length - 1);
      const scaleSplits = [];
      for (let i = 0; i < splitValues.length - 1; i++) {
        const scaleSplit = scaleLinear()
          .domain([splitValues[i], splitValues[i + 1]])
          .range([0, splitAverage]);
        scaleSplits.push(scaleSplit);
      }

      data.forEach((item) => {
        this.containerCircles
          .append('g')
          .attr('class', item.style)
          .selectAll('circle')
          .data(item.arr)
          .enter()
          .append('circle')
          .attr('r', radius)
          .attr('cx', () => {
            return Math.random() * width + splitLeft;
          })
          .attr('cy', (d) => {
            const index = splitValues.reduce((acc, current, index) => {
              return d <= current ? acc : index;
            }, 0);
            return (1 - index * splitAverage - scaleSplits[index](d)) * height;
          })
          .attr('fill', item.color);
      });
    }
  }
}

export default PieCompass;
