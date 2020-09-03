import echarts from 'echarts';
import { deepMerge } from '../../utils';
// 基础折线图
class LineMultistage {
  static defaultOptions = {
    smooth: false,
    symbol: {
      symbolSize: 8,
      color: '#eee',
      shape: 'circle',
    },
    splitLine: {
      color: '#51649F',
    },
    lineColor: '#4FFFB9',
    tooltip: {
      backgroundColor: '#284062',
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 800,
    },
    splitNumber: 10,
    xAxisLabel: {
      color: '#B1CAF3',
      fontSize: 16,
      margin: 20,
    },
    yAxisLabel: {
      color: '#B1CAF3',
      fontSize: 16,
      margin: 16,
    },
    tooltipIndex: 0,
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, LineMultistage.defaultOptions, options);
  }
  initChart() {
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    const {
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
          return `<div style="padding: 0 20px;
            height: 35px;
            line-height: 35px;
            text-align:center;
            font-size: ${tooltip.fontSize}px;
            border-left: 2px solid #B1CAF3;
            box-shadow: inset 0px 0px 10px 2px rgba(177, 202, 243, 0.5);
            color: ${tooltip.color};
            font-weight: ${tooltip.fontWeight};
            background-color: ${tooltip.backgroundColor};">
              <span style="font-size: ${tooltip.fontSize * 1.5}px;">
                ${number}
              </span> %
          </div>`;
        },
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      grid: {
        top: 60,
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      title: {
        text: '百分比',
        textStyle: {
          color: '#B1CAF3',
          fontWeight: 400,
        },
        left: '2%',
      },
      xAxis: [
        {
          type: 'category',
          data: this.data[0].data.map((item) => item.name),
          axisTick: {
            show: false,
            alignWithLabel: true,
            lineStyle: {
              color: '#bbb',
            },
          },
          axisLine: {
            lineStyle: {
              color: splitLine.color,
              type: 'solid',
              width: 0.5,
            },
          },
          axisLabel: xAxisLabel,
          splitLine: {
            show: false,
            lineStyle: {
              color: splitLine.color,
              type: 'solid',
              width: 0.5,
              opacity: 0.5,
            },
          },
        },
      ],
      yAxis: [
        {
          interval: 2,
          max: 10,
          splitNumber,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: splitLine.color,
              type: 'solid',
              width: 0.5,
            },
          },
          axisTick: {
            show: false,
            alignWithLabel: false,
            lineStyle: {
              color: '#bbb',
              width: 2,
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#bbb',
              width: 2,
            },
          },
          axisLabel: yAxisLabel,
        },
      ],
      series: this.data.map((item) => {
        return {
          type: 'line',
          barWidth: '60%',
          data: item.data.map((child) => child.value),
          symbol: symbol.shape,
          showSymbol: true,
          smooth,
          symbolSize: symbol.symbolSize,
          animationDuration: 500,
          lineStyle: {
            color: lineColor,
            width: 1.5,
            type: item.type,
          },
          emphasis: {
            color: '#3aa7ff',
            borderColor: '#3aa7ff',
          },
          itemStyle: {
            normal: {
              color: symbol.color,
            },
            emphasis: {
              borderWidth: 30,
              color: '#fff',
              borderColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0, 0, 0, 0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(0, 0, 0, 0)', // 100% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: '#ffffff', // 100% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: '#ffffff', // 100% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: 'rgba(0, 0, 0, 0)', // 100% 处的颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 0, 0, 0)', // 100% 处的颜色
                  },
                  {
                    offset: 0.9,
                    color: 'rgba(0, 0, 0, 0)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#ffffff', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        };
      }),
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

export default LineMultistage;
