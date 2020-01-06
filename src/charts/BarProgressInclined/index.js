import { select, scaleLinear } from 'd3';
import { deepMerge } from '../../utils';

class BarProgressInclined {
  constructor(container, options = {}) {
    this.container = container;
    this.options = deepMerge({}, BarProgressInclined.defaultOptions, options);
    this.svg = null;
  }
  static defaultOptions = {
    horizontal: false, // 纵向
    maskConfig: [
      {
        fill: 'rgba(14, 32, 100, 0.2)',
        stroke: '#0E2064',
      },
      {
        fill: 'rgba(100, 72, 18, 0.2)',
        stroke: '#776C0F',
      },
    ],
    valueConfig: [
      {
        fill: '#3E54FA',
        stroke: '#ffffff',
      },
      {
        fill: '#F1C90C',
        stroke: '#ffffff',
      },
    ],
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
    lineConfig: {
      width: 20,
      topLine: 1, // 顶部占长
      bottomLine: 0.95, // 底部占长
      animationTime: 1000,
    },
  };

  setData(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.data = data;
      this.drawLine();
    }
  }

  drawBar() {
    this.containerG = this.svg.append('g');
  }

  drawLine() {
    const { grid, lineConfig, maskConfig, valueConfig } = this.options;
    const RandId = Math.random()
      .toFixed(10)
      .replace('0.', '');
    const width = this.container.clientWidth,
      height = this.container.clientHeight;
    const scale = scaleLinear()
      .domain([0, this.data.length - 1])
      .range([
        grid.top + lineConfig.width / 2,
        height - grid.bottom - lineConfig.width / 2,
      ]);

    const lineItems = this.containerG
      .selectAll('g')
      .remove()
      .data(this.data)
      .enter()
      .append('g');
    // 增加背景框线
    const lineLengths = [];
    lineItems
      .append('polygon')
      .attr('points', (d, i) => {
        const x1 = grid.left,
          y1 = scale(i) - lineConfig.width / 2,
          x2 = (width - grid.right) * lineConfig.topLine,
          y2 = scale(i) + lineConfig.width / 2,
          x3 = (width - grid.right) * lineConfig.bottomLine;
        lineLengths.push({ x1, y1, x2, y2, x3 });
        return `${x1},${y1} ${x2},${y1} ${x3},${y2} ${x1},${y2}`;
      })
      .attr('stroke', (d, i) => {
        const { stroke } = maskConfig[i] || maskConfig[i % maskConfig.length];
        return stroke;
      })
      .attr('fill', (d, i) => {
        const { fill } = maskConfig[i] || maskConfig[i % maskConfig.length];
        return fill;
      });

    // 增加value条
    lineItems
      .append('polygon')
      .attr('points', (d, i) => {
        const num = d.value > 1 ? 1 : d.value < 0 ? 0 : d.value; // value 值不能大于 0 且不能小于 0
        const { x1, y1, y2 } = lineLengths[i];
        let { x2, x3 } = lineLengths[i];
        x2 *= num;
        x3 *= num;
        return `${x1},${y1} ${x2},${y1} ${x3},${y2} ${x1},${y2}`;
      })
      .attr('stroke', (d, i) => {
        const { stroke } =
          valueConfig[i] || valueConfig[i % valueConfig.length];
        return stroke;
      })
      .attr('fill', (d, i) => {
        const { fill } = valueConfig[i] || valueConfig[i % valueConfig.length];
        return fill;
      })
      .attr('clip-path', (d, i) => `url(#clipPath${RandId}${i})`);

    // 增加切割线
    lineItems
      .append('clipPath')
      .attr('id', (d, i) => {
        return `clipPath${RandId}${i}`;
      })
      .append('rect')
      .attr('x', (d, i) => lineLengths[i].x1)
      .attr('y', (d, i) => scale(i) - lineConfig.width / 2)
      .attr('width', 0)
      .attr('height', lineConfig.width)
      .transition()
      .duration(2000)
      .attr('width', width - grid.left - grid.right);

    // 增加左侧白线条
    lineItems
      .append('rect')
      .attr('x', (d, i) => lineLengths[i].x1)
      .attr('y', (d, i) => scale(i) - lineConfig.width / 2)
      .attr('width', 3)
      .attr('height', lineConfig.width)
      .attr('fill', '#ffffff');
  }

  initChart() {
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
    this.drawBar();
  }
}

export default BarProgressInclined;
