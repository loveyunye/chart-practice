import { select } from 'd3';
import { deepMerge } from '../../utils';

class BarProgress {
  constructor(container, options = {}) {
    this.container = container;
    this.options = deepMerge({}, BarProgress.defaultOptions, options);
    this.svg = null;
  }
  static defaultOptions = {
    maxLength: 0.9, // 最长占比
    maskLine: {
      stroke: '#51649F',
      strokeWidth: 10,
      strokeLinecap: 'round',
    },
    valueLine: {
      stroke: '#4FFFB9',
      strokeWidth: 20,
      strokeLinecap: 'round',
    },
    animationTime: 1000,
  };

  setData(data) {
    if (isNaN(Number(data))) {
      return;
    }
    const width = this.container.clientWidth;
    const { maxLength, animationTime } = this.options;
    this.line
      .transition()
      .duration(animationTime)
      .attr('x2', width * maxLength * data);
  }

  drawBar() {
    const { maxLength, maskLine, valueLine } = this.options;
    const width = this.container.clientWidth * maxLength,
      height = this.container.clientHeight,
      g = this.svg
        .append('g')
        .attr(
          'transform',
          `translate(${(width * (1 - maxLength)) / 2}, ${height / 2})`,
        );
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke-width', maskLine.strokeWidth)
      .style('stroke-linecap', maskLine.strokeLinecap)
      .attr('stroke', maskLine.stroke);
    this.line = g
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke-width', valueLine.strokeWidth)
      .style('stroke-linecap', valueLine.strokeLinecap)
      .attr('stroke', valueLine.stroke);
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

export default BarProgress;
