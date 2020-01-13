import { select, arc as d3Arc, pie, color } from 'd3';
import { deepMerge } from '../../utils';

class PiePercentage {
  static defaultOptions = {};

  constructor(container, option = {}) {
    this.container = container;
    this.option = deepMerge({}, PiePercentage.defaultOptions, option);
    this.svg = null;
  }
  setOptions() {
    const arc = d3Arc()
      .innerRadius(120)
      .outerRadius(60)
      .cornerRadius(20);

    const width = this.container.clientWidth,
      height = this.container.clientHeight,
      g = this.svg
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    const data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const arcs = pie()(data);
    g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .style('fill', function(d) {
        return color('hsl(120, 50%, ' + d.value + '%)');
      })
      .attr('d', arc);

    // 圆弧
    // const arc2 = d3Arc()
    //   .innerRadius(140)
    //   .outerRadius(140);
    // g.append('path')
    //   .attr(
    //     'd',
    //     arc2({
    //       startAngle: -0.5 * Math.PI,
    //       endAngle: 0.5 * Math.PI,
    //     }),
    //   )
    //   .attr('stroke', '#ffffff')
    //   .attr('stroke-width', 2)
    //   .attr('stroke-dasharray', '3,10')
    //   .attr('fill', 'none');
  }
  setData() {
    this.setOptions();
  }
  initChart() {
    const { clientWidth, clientHeight } = this.container;
    this.svg = select(this.container)
      .append('svg')
      .style('width', `${clientWidth}px`)
      .style('height', `${clientHeight}px`);
  }
  destroy() {}
}

export default PiePercentage;
