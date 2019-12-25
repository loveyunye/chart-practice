import echarts from 'echarts';
import { deepMerge } from '../utils';

// 基础柱状图
class BarGeneral {
  static defaultOptions = {
    areaColors: [
      { offset: 0, color: 'rgba(87, 239, 101, 1)' },
      { offset: 1, color: 'rgba(87, 239, 101, 0.1)' },
    ],
    splitLine: {
      color: 'rgba(87, 239, 101, 0.2)',
      type: 'dashed',
    },
    label: {
      show: true,
      position: 'top',
      color: 'rgba(87, 239, 101, 1)',
      fontSize: 20,
    },
    xAxisLabel: {
      color: '#ddd',
      fontSize: 20,
    },
    yAxisLabel: {
      color: '#ddd',
      fontSize: 20,
    },
    barWidth: 40,
    splitNumber: 3,
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

  setOptions() {
    const {
      areaColors,
      splitLine,
      label,
      xAxisLabel,
      yAxisLabel,
      barWidth,
      splitNumber,
    } = this.options;
    this.chart.setOption({
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
          },
          label,
        },
      ],
    });
  }

  setData(data) {
    this.data = data;
    this.setOptions();
  }

  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default BarGeneral;
