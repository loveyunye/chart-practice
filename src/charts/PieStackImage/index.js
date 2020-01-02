import { select } from 'd3';
import { deepMerge } from '../../utils';
import MainPng from './studyStatus.png';

class PieStackImage {
  static defaultOption = {};

  constructor(container, option = {}) {
    this.container = container;
    this.option = deepMerge({}, PieStackImage.defaultOption, option);
    this.svg = null;
  }

  drawPie() {
    const { clientWidth: width, clientHeight } = this.container;
    this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${clientHeight / 2})`)
      .append('image')
      .attr('xlink:href', MainPng)
      .attr('height', 126)
      .attr('width', 216)
      .attr('y', -63)
      .attr('x', -108);
  }

  setData(data) {
    this.data = data;
    console.log(data);
  }

  initChart() {
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
    this.drawPie();
  }
}

export default PieStackImage;
