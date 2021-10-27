import echarts from 'echarts';
import { deepMerge } from '@/utils';

// 基础折线图
class Line {
  static defaultOptions = {
    areaColors: [
      { offset: 0, color: 'rgba(0,255,234, 0.3)' },
      { offset: 1, color: 'rgba(0, 255, 234, 0)' },
    ],
    smooth: false,
    symbol: {
      symbolSize: 6,
      color: '#00FFFF',
      shape: 'circle',
    },
    splitLine: {
      color: 'rgba(255, 255, 255, 0.2)',
    },
    lineColor: '#00FFFF',
    tooltip: {
      backgroundColor: 'rgba(0,255,234, 0.3)',
      color: '#00FFFF',
      fontSize: 20,
      fontWeight: 800,
    },
    splitNumber: 6,
    xAxisLabel: {
      color: '#00FFEA',
      fontSize: 12,
      margin: 12,
    },
    yAxisLabel: {
      color: '#00FFEA',
      fontSize: 12,
      margin: 12,
    },
    lineName: ['全省', '全国'],
  };
  constructor(container, options = {}) {
    this.container = container;
    this.options = deepMerge({}, Line.defaultOptions, options);
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    const {
      smooth,
      symbol,
      splitLine,
      splitNumber,
      xAxisLabel,
      yAxisLabel,
      lineName,
    } = this.options;
    // const index = this.data[0].length > this.data[1].length ? 0 : 1
    console.log();

    const min = Math.min(
      ...[...this.data[0], ...this.data[1]]
        .filter((i) => i.value)
        .map((i) => i.value),
    );

    this.chart.setOption({
      grid: {
        top: 20,
        left: '0',
        right: '0',
        bottom: '0',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        // data: this.data[index].map((item) => item.name),
        data: Array.from(new Array(12)).map((i, index) => `${index + 1}月`),
        axisTick: {
          show: false,
          alignWithLabel: true,
          lineStyle: {
            color: '#bbb',
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0)',
          },
        },
        axisLabel: xAxisLabel,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        splitNumber,
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: splitLine.color,
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        min,
        axisLabel: yAxisLabel,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        // triggerOn: 'click',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: {
          color: '#fff',
          width: 100,
          overflow: 'break',
        },
        renderMode: 'html',
        className: 'line-tip',
        formatter(value) {
          const axisValue = value[0].axisValue;
          return [
            axisValue,
            `${value[0].marker}${
              value[0].seriesName
            }:   <span style="font-weight: 800;margin-left: 10px;">${(value[0]
              .data
              ? value[0].data + '%'
              : '') || '-'}</span>`,
            `${value[1].marker}${
              value[1].seriesName
            }:   <span style="font-weight: 800;margin-left: 10px;">${(value[1]
              .data
              ? value[1].data + '%'
              : '') || '-'}</span>`,
          ].join('<br />');
        },
      },
      series: [
        {
          name: lineName[0],
          type: 'line',
          barWidth: '60%',
          data: this.data[0].map((item) => item.value),
          symbol: symbol.shape,
          smooth,
          symbolSize: symbol.symbolSize,
          animationDuration: 500,
          lineStyle: {
            color: '#FD17E0',
            width: 2,
          },
          itemStyle: {
            color: '#FD17E0',
            // color: symbol.color,
          },
        },
        {
          name: lineName[1],
          type: 'line',
          barWidth: '60%',
          data: this.data[1].map((item) => item.value),
          symbol: symbol.shape,
          smooth,
          symbolSize: symbol.symbolSize,
          animationDuration: 500,
          lineStyle: {
            color: '#00FFEA',
            width: 2,
          },
          itemStyle: {
            color: '#00FFEA',
            // color: symbol.color,
          },
        },
      ],
    });
  }

  setData(data, options = {}) {
    this.data = data;
    console.log(JSON.stringify(this.data));

    this.options = deepMerge({}, this.options, options);
    this.updateOptions();
  }

  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default Line;
