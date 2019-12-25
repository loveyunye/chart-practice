import echarts from 'echarts';
import { deepMerge } from '../utils';

// 堆叠柱状图
/**
 * data 结构
 * data = [
 *  {
 *    name: '进口',
 *    data: [
 *      {
 *        name: '2019',
 *        value: 2320
 *      }
 *    ]
 *  }
 * ]
 */
class BarGeneral {
  static defaultOptions = {
    splitLine: {
      color: 'rgba(87, 239, 101, 0.2)',
      type: 'dashed',
    },
    smooth: true,
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
    areaColors: [
      [
        { offset: 0, color: 'rgba(0, 232, 255, 0.5)' },
        { offset: 1, color: 'rgba(0, 232, 255, 0.1)' },
      ],
      [
        { offset: 0, color: 'rgba(87, 239, 101, 0.5)' },
        { offset: 1, color: 'rgba(87, 239, 101, 0.1)' },
      ],
    ],
    defaultArea: [{ offset: 0, color: 'rgba(0, 232, 255, 1)' }],
    lineColors: ['rgba(0, 232, 255, 1)', 'rgba(87, 239, 101, 1)'],
    lineWidth: 4,
    symbol: {
      symbol: 'rect',
      symbolSize: 12,
    },
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
      splitLine,
      xAxisLabel,
      yAxisLabel,
      splitNumber,
      areaColors,
      defaultArea,
      lineColors,
      smooth,
      legend,
      lineWidth,
      symbol,
      yAxisLine,
    } = this.options;
    this.chart.setOption({
      legend: legend || {
        left: 'center',
        bottom: '0%',
        icon: 'rect',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
        itemHeight: 20,
        itemWidth: 20,
        itemGap: 30,
        selectedMode: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      grid: {
        top: 20,
        left: '4%',
        right: '4%',
        bottom: '14%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: this.data[0].data.map((item) => item.name),
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#bbb',
            },
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
          axisLine: yAxisLine || {
            show: false,
          },
          axisLabel: yAxisLabel,
        },
      ],
      series: this.data.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data.map((child) => child.value),
          animationDuration: 500,
          lineStyle: {
            color: lineColors[index],
            width: lineWidth,
          },
          smooth,
          symbol: symbol.symbol,
          symbolSize: symbol.symbolSize,
          itemStyle: {
            color: lineColors[index],
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: areaColors[index] || defaultArea,
              global: false,
            },
          },
        };
      }),
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
