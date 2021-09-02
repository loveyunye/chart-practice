import echarts from 'echarts';
import { deepMerge } from '@/utils';

// 基础折线图
class LineBase {
  static defaultOptions = {
    areaColors: [
      { offset: 0, color: 'rgba(87, 239, 101, 0.3)' },
      { offset: 1, color: 'rgba(87, 239, 101, 0)' },
    ],
    smooth: true,
    symbol: {
      symbolSize: 12,
      color: 'rgba(87, 239, 101, 1)',
      shape: 'circle',
    },
    splitLine: {
      color: 'rgba(87, 239, 101, 0.2)',
    },
    lineColor: 'rgba(87, 239, 101, 1)',
    tooltip: {
      backgroundColor: 'rgba(87, 239, 101, 0.3)',
      color: 'rgba(87, 239, 101, 1)',
      fontSize: 20,
      fontWeight: 800,
    },
    splitNumber: 5,
    xAxisLabel: {
      color: '#ddd',
      fontSize: 14,
    },
    yAxisLabel: {
      color: '#ddd',
      fontSize: 14,
    },
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, LineBase.defaultOptions, options);
  }
  initChart() {
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    const {
      areaColors,
      smooth,
      symbol,
      splitLine,
      lineColor,
      splitNumber,
      xAxisLabel,
      yAxisLabel,
      tooltip,
    } = this.options;
    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        formatter(value) {
          const number = value[0].data
            .toString()
            .replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
          return `<div style="padding: 0 20px;
            height: 40px;
            line-height: 40px;
            text-align:center;
            border-radius: 24px;
            font-size: ${tooltip.fontSize}px;
            color: ${tooltip.color};
            font-weight: ${tooltip.fontWeight};
            background-color: ${tooltip.backgroundColor};">${number}</div>`;
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
          data: this.data.map((item) => item.name),
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#bbb',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#bbb',
            },
          },
          axisLabel: xAxisLabel,
          splitLine: {
            show: true,
            lineStyle: {
              color: splitLine.color,
              type: 'dashed',
            },
          },
        },
      ],
      yAxis: [
        {
          splitNumber,
          type: 'value',
          splitLine: {
            show: false,
          },
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#bbb',
              width: 1,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#bbb',
              width: 1,
            },
          },
          axisLabel: yAxisLabel,
        },
      ],
      series: [
        {
          name: 'pageA',
          type: 'line',
          stack: 'vistors',
          barWidth: '60%',
          data: this.data.map((item) => item.value),
          symbol: symbol.shape,
          smooth,
          symbolSize: symbol.symbolSize,
          animationDuration: 500,
          lineStyle: {
            color: lineColor,
            width: 4,
          },
          itemStyle: {
            color: symbol.color,
          },
          areaStyle: {
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

export default LineBase;
