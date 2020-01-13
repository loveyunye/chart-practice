import { select, arc as d3Arc, pie, scaleLinear, easeLinear } from 'd3';
import { deepMerge } from '../../utils';

class PieDonut {
  constructor(container, option = {}) {
    this.container = container;
    this.options = deepMerge({}, PieDonut.defaultOptions, option);
    this.svg = null;
  }

  static defaultOptions = {
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
    arcBall: {
      number: 3,
      time: 3000,
      radius: 80,
      arcColor: 'rgba(255, 255, 255, 0.8)',
      ballColor: 'rgb(49, 150, 250, 0.8)',
      ballRadius: 8,
    },
    animateTime: 1500,
    text: {
      color: [
        { offset: 0, color: '#62C232' },
        { offset: 1, color: '#ffffff' },
      ],
      decimalPlaces: 0, // 小数位数
      fontSize: 50,
      fontWight: 500,
    },
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
    const { arcBall, text } = this.options;
    const { clientWidth: width, clientHeight } = this.container;
    this.containerG = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${clientHeight / 2})`);

    // 绘制圈
    this.innerCircle = this.containerG.append('g').attr('class', 'circle');
    this.innerCircle
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', arcBall.radius)
      .attr('stroke', arcBall.arcColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 5')
      .attr('fill', 'none');

    // 绘制球
    const dataBall = Array.from(new Array(arcBall.number));
    const itemAngle = (Math.PI * 2) / arcBall.number;
    this.ballItems = this.innerCircle
      .append('g')
      .attr('class', 'ball-container')
      .selectAll('circle')
      .data(dataBall)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => {
        return arcBall.radius * Math.cos(itemAngle * i).toFixed('3');
      })
      .attr('cy', (d, i) => {
        return arcBall.radius * Math.sin(itemAngle * i).toFixed('3');
      })
      .attr('r', arcBall.ballRadius)
      .attr('fill', arcBall.ballColor);

    // 动画
    this.circleAnimate();
    this.timer = setInterval(() => {
      this.circleAnimate();
    }, arcBall.time);

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
  }

  // 动画
  circleAnimate() {
    if (this.container && this.svg) {
      const { time } = this.options.arcBall;
      let _current = 0;
      this.ballItems
        .attr('transform', 'rotate(0)')
        .transition()
        .ease(easeLinear)
        .duration(time)
        .attrTween('transform', () => {
          const linearData = scaleLinear().range([_current, 360]);
          const linearAngle = scaleLinear().domain([0, 1]);
          return (t) => {
            _current = linearData(t);
            const angle = linearAngle(_current);
            return `rotate(${angle})`;
          };
        });
    } else {
      this.destroy();
    }
  }

  drawArc() {
    const { grid, arcWidth, animateTime, text } = this.options;
    const { clientWidth: width, clientHeight: height } = this.container;
    const diameter =
      width > height
        ? height - grid.top - grid.bottom
        : width - grid.left - grid.right;

    // 绘制圆环
    const valueArc = d3Arc()
      .outerRadius(diameter / 2)
      .innerRadius(diameter / 2 - arcWidth.value)
      .cornerRadius(arcWidth.value / 2);
    const emptyArc = d3Arc()
      .outerRadius(diameter / 2 - arcWidth.value / 2 + arcWidth.empty / 2)
      .innerRadius(diameter / 2 - arcWidth.value / 2 - arcWidth.empty / 2)
      .cornerRadius(arcWidth.empty / 2);

    // 处理数据
    let data = [0.01, 0.98 - this.data, 0.01, this.data],
      emptyTime = animateTime * (1 - this.data),
      valueTime = animateTime * this.data;
    if (this.data > 0.98) {
      data = [0.5 - this.data / 2, 0, 0.5 - this.data / 2, this.data];
      emptyTime = 0;
      valueTime = animateTime;
    }
    const arcs = pie().sort(null)(data);
    this.containerG.selectAll('path').remove();

    // empty 动画
    let currentEmpty = 0;
    this.containerG
      .append('path')
      .style('fill', '#2EA9E6')
      .transition()
      .ease(easeLinear)
      .duration(emptyTime)
      .attrTween('d', () => {
        const linearData = scaleLinear().range([
          currentEmpty || 0.01,
          this.data > 0.98 ? 0 : 0.98 - this.data,
        ]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          currentEmpty = linearData(t);
          const angle = linearAngle(currentEmpty);
          return emptyArc({
            startAngle: arcs[1].startAngle,
            endAngle: angle * Math.PI * 2 + arcs[1].startAngle,
          });
        };
      });

    // value 动画
    let currentValue = 0;
    this.containerG
      .append('path')
      .style('fill', '#62C232')
      .transition()
      .ease(easeLinear)
      .delay(emptyTime)
      .duration(valueTime)
      .attrTween('d', () => {
        const linearData = scaleLinear().range([currentValue || 0, this.data]);
        const linearAngle = scaleLinear().domain([0, 1]);
        return (t) => {
          currentValue = linearData(t);
          const angle = linearAngle(currentValue);
          return valueArc({
            startAngle: arcs[3].startAngle,
            endAngle: angle * Math.PI * 2 + arcs[3].startAngle,
          });
        };
      });

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
      // .tween('text', function() {
      //   const i = interpolateRound(0, 90);
      //   return function(t) {
      //     this.textContent = `${i(t)}%`;
      //   };
      // });
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

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  setData(data) {
    this.data = Number(data);
    this.drawArc();
  }
}
export default PieDonut;
