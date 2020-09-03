import echarts from 'echarts';
import { deepMerge } from '../../utils';

// 基础柱状图
class BarGeneral {
  static defaultOptions = {
    areaColors: [
      { offset: 0, color: '#2865BC' },
      { offset: 1, color: '#0585F2' },
    ],
    tooltip: {
      backgroundColor: '#284062',
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 800,
    },
    splitLine: {
      color: 'rgba(87, 239, 101, 0.2)',
    },
    label: {
      show: false,
      position: 'top',
      color: 'rgba(87, 239, 101, 1)',
      fontSize: 20,
    },
    xAxisLabel: {
      color: '#ddd',
      fontSize: 16,
    },
    yAxisLabel: {
      color: '#ddd',
      fontSize: 16,
      show: false,
    },
    barWidth: 32,
    splitNumber: 5,
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, BarGeneral.defaultOptions, options);
  }
  initChart() {
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    const {
      areaColors,
      splitLine,
      label,
      xAxisLabel,
      yAxisLabel,
      barWidth,
      splitNumber,
      tooltip,
    } = this.options;
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
        crossStyle: {
          opacity: 0,
        },
        formatter(value) {
          const number = value.data
            .toString()
            .replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
          return `<div style="padding: 0 16px;
            height: 35px;
            line-height: 34px;
            text-align:center;
            font-size: ${tooltip.fontSize}px;
            border-left: 2px solid #B1CAF3;
            box-shadow: inset 0px 0px 10px 2px rgba(177, 202, 243, 0.5);
            color: ${tooltip.color};
            font-weight: ${tooltip.fontWeight};
            background-color: ${tooltip.backgroundColor};">
              <span style="font-size: ${tooltip.fontSize * 1.5}px;">
                ${number}
              </span>
          </div>`;
        },
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      grid: {
        top: 20,
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: this.data.map((item) => item.name),
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: xAxisLabel,
        },
      ],
      yAxis: [
        {
          splitNumber,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: splitLine,
            width: 2,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: yAxisLabel,
        },
      ],
      series: [
        {
          type: 'bar',
          stack: 'vistors',
          data: this.data.map((item) => item.value),
          animationDuration: 500,
          barWidth,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: areaColors,
              global: false,
            },
            barBorderRadius: [barWidth / 2, barWidth / 2, 0, 0],
          },
          label,
        },
      ],
    });
  }

  setData(data) {
    this.data = data;
    this.updateOptions();
  }

  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default BarGeneral;
