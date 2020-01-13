import { select } from 'd3';
import { deepMerge } from '../../utils';
import MainPng from './studyStatus.png';

class PieStackImage {
  static defaultOptions = {
    line: {
      color: '#42DEFF',
      width: 1,
    },
    text: {
      color: '#fff',
      fontSize: 16,
      unit: '人',
    },
  };

  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieStackImage.defaultOptions, option);
    this.svg = null;
    this.labelLines = [
      {
        points: '108,40 126,20 148,20',
        text: { x: 160, y: 10, value: 0, name: '' },
      },
      {
        points: '-86,6 -104,-12 -135,-12',
        text: { x: -180, y: -20, value: 0, name: '' },
      },
      {
        points: '63,-30 85,-51 108,-51',
        text: { x: 120, y: -60, value: 0, name: '' },
      },
      {
        points: '-28,-66 -45,-101 -68,-101',
        text: { x: -110, y: -110, value: 0, name: '' },
      },
    ];
  }

  drawPie() {
    const { clientWidth: width, clientHeight } = this.container;
    this.containerG = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${clientHeight / 2})`);
    this.containerG
      .append('image')
      .attr('xlink:href', MainPng)
      .transition()
      .duration(750)
      .attr('height', 182)
      .attr('width', 216)
      .attr('y', -70)
      .attr('x', -108);
  }

  drawPolyline(points) {
    const { line } = this.options;
    this.containerG
      .append('polyline')
      .attr('stroke', line.color)
      .attr('stroke-width', `${line.width}px`)
      .attr('fill', 'none')
      .attr('stroke-dasharray', '100 100')
      .attr('stroke-dashoffset', '100%')
      .transition()
      .delay(200)
      .attr('points', points)
      .duration(1000)
      .attr('stroke-dashoffset', '0');
  }

  drawText(textItem) {
    const { text: textConfig } = this.options;
    const text = this.containerG
      .append('text')
      .attr('y', textItem.y)
      .attr('fill', '#ffffff')
      .attr('font-size', `${textConfig.fontSize}px`)
      .attr('opacity', '0');
    text
      .transition()
      .delay(200)
      .duration(1000)
      .attr('opacity', '1');
    text
      .append('tspan')
      .attr('dy', '1em')
      .attr('x', textItem.x)
      .text(textItem.name);
    text
      .append('tspan')
      .attr('dy', '1.2em')
      .attr('font-size', `${textConfig.fontSize * 1.25}px`)
      .attr('x', textItem.x)
      .text(`${textItem.value}${textConfig.unit}`);
    return text;
  }

  setData(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.data = data.sort((a, b) => b.value - a.value);
      this.containerG.selectAll('polyline').remove();
      this.containerG.selectAll('text').remove();
      this.labelLines.forEach((item, index) => {
        item.text.value = this.data[index].value || 0;
        item.text.name = this.data[index].name || '';
        this.drawPolyline(item.points);
        this.drawText(item.text);
      });
    }
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
