// import { select, arc as d3Arc, pie, color, scaleLinear, easeElastic } from 'd3';
import { select, arc as d3Arc, pie, color } from 'd3';
import { deepMerge } from '../../utils';

class PiePercentage {
  static defaultOption = {};

  constructor(container, option = {}) {
    this.container = container;
    this.option = deepMerge({}, PiePercentage.defaultOption, option);
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
    // const arcs = pie()([1]);
    // console.log(arcs[0]);
    // // g.attr('transform', 'rotate(90deg)');

    // g.append('path')
    //   .style('fill', function() {
    //     return color('hsl(120, 30%, 10%)');
    //   })
    //   .attr(
    //     'd',
    //     arc({
    //       startAngle: -Math.PI / 2,
    //       endAngle: Math.PI / 2,
    //     }),
    //   );
    // g.append('path')
    //   .style('fill', function() {
    //     return color('hsl(120, 50%, 89%)');
    //   })
    //   .transition()
    //   .duration(2000)
    //   .ease(easeElastic)
    //   .attrTween('d', () => {
    //     const linearData = scaleLinear().range([this._current || 0, 20]);
    //     const linearAngle = scaleLinear().domain([0, 21]);
    //     return (t) => {
    //       this._current = linearData(t);
    //       const angle = linearAngle(this._current);
    //       return arc({
    //         startAngle: -Math.PI / 2,
    //         endAngle: angle * Math.PI - Math.PI / 2,
    //       });
    //     };
    //   });
    const data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    const arcs = pie()(data);
    // console.log(arcs, arc);
    g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .style('fill', function(d) {
        return color('hsl(120, 50%, ' + d.value + '%)');
      })
      .attr('d', arc);
  }
  setData() {
    // console.log(data);
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
