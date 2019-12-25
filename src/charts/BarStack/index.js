import echarts from 'echarts';
import { deepMerge } from '../../utils';

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
    legend: {
      left: 'center',
      bottom: '0%',
      icon: 'rect',
      itemHeight: 20,
      itemWidth: 20,
    },
    splitLine: {
      color: 'rgba(87, 239, 101, 0.2)',
      type: 'dashed',
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
    areaColors: [
      [{ offset: 0, color: '#0078FF' }],
      [{ offset: 0, color: '#F7643C' }],
    ],
    defaultArea: [{ offset: 0, color: '#0078FF' }],
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
      legend,
      areaColors,
      splitLine,
      xAxisLabel,
      yAxisLabel,
      barWidth,
      splitNumber,
      defaultArea,
    } = this.options;
    this.chart.setOption({
      legend: {
        ...legend,
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
        itemGap: 30,
        selectedMode: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(255, 255, 255, 0)',
          },
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
      series: this.data.map((item, index) => {
        return {
          name: item.name,
          type: 'bar',
          stack: 'vistors',
          data: item.data.map((child) => child.value),
          animationDuration: 500,
          barWidth,
          itemStyle: {
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
