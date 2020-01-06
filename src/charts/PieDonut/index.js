import { select, arc as d3Arc, pie, scaleLinear } from 'd3';
import { deepMerge } from '../../utils';

class PieDonut {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieDonut.defaultOption, option);
    this.svg = null;
  }

  static defaultOption = {
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    arcWidth: {
      empty: 10,
      value: 20,
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
  }

  drawPie() {
    const { clientWidth: width, clientHeight } = this.container;
    this.containerG = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${clientHeight / 2})`);
    this.containerG
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 60)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('fill', 'none');
  }

  drawArc() {
    const { grid, arcWidth, animateTime } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    const diameter =
      width > height
        ? height - grid.top - grid.bottom
        : width - grid.left - grid.right;

    const arcValue = d3Arc()
      .outerRadius(diameter / 2)
      .innerRadius(diameter / 2 - arcWidth.value)
      .cornerRadius(arcWidth.value / 2);
    const emptyValue = d3Arc()
      .outerRadius(diameter / 2 - arcWidth.value / 2 + arcWidth.empty / 2)
      .innerRadius(diameter / 2 - arcWidth.value / 2 - arcWidth.empty / 2)
      .cornerRadius(arcWidth.empty / 2);
    let data = [0.01, 0.98 - this.data, 0.01, this.data],
      emptyTime = animateTime * (1 - this.data),
      valueTime = animateTime * this.data;
    if (this.data > 0.98) {
      data = [0.5 - this.data / 2, 0, 0.5 - this.data / 2, this.data];
      emptyTime = 0;
      valueTime = animateTime;
    }
    const arcs = pie().sort(null)(data);
    this.containerG
      .append('path')
      .style('fill', '#2EA9E6')
      .transition()
      .duration(emptyTime)
      .attrTween('d', () => {
        const linearData = scaleLinear().range([
          this._current || 0.01,
          this.data > 0.98 ? 0 : 0.98 - this.data,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this._current = linearData(t);
          const angle = linearAngle(this._current);
          return emptyValue({
            startAngle: arcs[1].startAngle,
            endAngle: angle * Math.PI * 2 + arcs[1].startAngle,
          });
        };
      });
    this.containerG
      .append('path')
      .style('fill', '#62C232')
      .transition()
      .delay(emptyTime)
      .duration(valueTime)
      .attrTween('d', () => {
        const linearData = scaleLinear().range([
          this._current2 || 0,
          this.data,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          this._current2 = linearData(t);
          const angle = linearAngle(this._current2);
          return arcValue({
            startAngle: arcs[3].startAngle,
            endAngle: angle * Math.PI * 2 + arcs[3].startAngle,
          });
        };
      });
  }

  setData(data) {
    this.data = data;
    this.drawArc();
  }
}
export default PieDonut;
