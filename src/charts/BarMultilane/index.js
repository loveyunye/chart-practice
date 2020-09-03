import { deepMerge } from '../../utils';
import echarts from 'echarts';

class BarMultilane {
  constructor(container, options = {}) {
    this.container = container;
    this.options = deepMerge({}, BarMultilane.defaultOptions, options);
    this.chart = null;
  }
  static defaultOptions = {
    areaColors: [
      [
        { offset: 0, color: 'rgba(255,197,86, 0.37)' },
        { offset: 1, color: '#FFD16E' },
      ],
      [
        { offset: 0, color: 'rgba(31, 68, 255, 0.37)' },
        { offset: 1, color: '#6E89FF' },
      ],
    ],
    units: ['万元', '个'],
    borderColors: ['#FFFC15', '#49A3FF'],
    splitLine: {
      color: '#51649F',
    },
    xAxisLabel: {
      color: '#ffffff',
      fontSize: 12,
      margin: 10,
      interval: 0,
      lineHeight: 16,
    },
    yAxisLabel: {
      color: '#B1CAF3',
      fontSize: 12,
      margin: 16,
      interval: 1,
    },
    splitNumber: 8, // 间隔数
    xAxisTick: {
      // show: false,
      alignWithLabel: true,
      inside: true,
      lineStyle: {
        width: 2,
        length: 4,
        color: '#fff',
      },
    },
  };

  updateOptions() {
    const {
      xAxisLabel,
      yAxisLabel,
      splitLine,
      areaColors,
      borderColors,
      splitNumber,
      units,
      xAxisTick,
    } = this.options;
    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 60,
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: this.data[0].data.map((item) => item.name),
          axisPointer: {
            type: 'shadow',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: splitLine.color,
              type: 'solid',
              width: 0.5,
            },
          },
          axisLabel: xAxisLabel,
          axisTick: {
            ...xAxisTick,
          },
        },
      ],
      yAxis: this.data.map((item, index) => {
        const maxX = Math.max(...item.data.map((item) => item.value));
        const powNum = parseInt(maxX).toString().length;
        let interval =
          (Number((maxX / splitNumber).toString().substr(0, 1)) + 1) *
          Math.pow(10, powNum - 2 < 0 ? 0 : powNum - 2);
        if (interval * splitNumber < maxX) {
          interval *= 10;
        }
        return {
          type: 'value',
          name: `${item.name}/${units[index]}`,
          color: '#ffffff',
          min: 0,
          ...{
            max: interval * splitNumber,
            splitNumber,
            interval,
          },
          axisLabel: {
            ...yAxisLabel,
          },
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: '#ffffff',
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: splitLine.color,
              type: 'solid',
              width: 0.5,
            },
          },
        };
      }),
      series: this.data.map((item, index) => {
        return {
          name: item.name,
          data: item.data.map((item) => item.value),
          type: 'bar',
          barGap: '80%',
          // barCategoryGap: '80%',
          emphasis: {
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              formatter(params) {
                return `{a|${params.value}}`;
              },
              rich: {
                a: {
                  lineHeight: 10,
                  fontSize: 16,
                },
              },
            },
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: areaColors[index],
              global: false,
            },
            borderWidth: 1,
            borderColor: borderColors[index],
          },
          barWidth: 10,
          yAxisIndex: index,
        };
      }),
    });
  }

  setData(data) {
    this.data = data;
    this.updateOptions();
  }

  initChart() {
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default BarMultilane;
