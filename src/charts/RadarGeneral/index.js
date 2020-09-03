import echarts from 'echarts';
import { deepMerge } from '../../utils';

class RadarGeneral {
  static defaultOptions = {
    areaStyle: {
      splitNum: 5, // 分割段数
      maxAreaOpacity: 0.2, // 最大透明度
      minAreaOpacity: 0.05, // 最小透明度
    },
    axisLine: {
      lineStyle: {
        opacity: 0.3,
        width: 0.5,
        color: '#fff',
      },
    },
    nameStyle: {
      color: '#ffffff',
      align: 'center',
      fontSize: 16,
      lineHeight: 20,
    },
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, RadarGeneral.defaultOptions, options);
  }

  updateOptions() {
    const { areaStyle, axisLine, nameStyle } = this.options;

    const { splitNum, maxAreaOpacity, minAreaOpacity } = areaStyle;
    const areaStepOpacity = (maxAreaOpacity - minAreaOpacity) / splitNum;
    this.chart.setOption({
      radar: {
        center: ['50%', '60%'],
        indicator: this.data.map((item) => {
          return {
            text: item.name,
            max: item.max,
          };
        }),
        splitArea: {
          areaStyle: {
            color: Array.from(new Array(splitNum)).map(
              (item, index) =>
                `rgba(255, 255, 255, ${maxAreaOpacity -
                  index * areaStepOpacity})`,
            ),
          },
        },
        nameGap: 30,
        splitLine: {
          show: false,
        },
        name: {
          ...nameStyle,
          formatter: (text) => {
            const number = this.data.find((item) => item.name === text).value;
            // return `{a|${number}%}\n{b|${text}}`;
            return `${number}%\n${text}`;
          },
          // rich: {
          //   a: {
          //     color: '#ffffff',
          //     align: 'center',
          //     fontSize: 20,
          //   },
          //   b: {
          //     color: 'red',
          //     align: 'center',
          //     fontSize: 16,
          //   },
          // },
        },
        axisLine,
      },
      series: [
        {
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default',
                color: '#11D463',
                opacity: 0.5,
              },
              // color: 'rgba(0, 0, 0, 0)',
            },
          },
          lineStyle: {
            color: '#ffffff',
            width: 1,
          },
          symbol: 'none',
          data: [
            {
              value: this.data.map((item) => item.value),
            },
          ],
        },
      ],
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

export default RadarGeneral;
