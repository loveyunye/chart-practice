import * as echarts from 'echarts';
import { deepMerge } from '@/utils';

/**
 * 指标对比饼图
 */
class PieInvest {
  static defaultOptions = {
    series: ['#F1F1F1', '#FFC44E'],
    globalStyle: {
      center: {
        x: 50,
        y: 50,
      },
      itemStyle: {
        borderColor: '#F1F1F1',
        borderType: 'solid',
        borderWidth: 2,
        borderRadius: 8,
      },
      radius: {
        inner: 50,
        outer: 65,
      },
    },
    label: {
      labelLine: {
        color: '#666',
        length: 5,
        length2: 10,
        show: true,
        type: 'solid',
        width: 1,
      },
      position: 'outside',
      show: true,
      textStyle: {
        color: '#999999',
        fontFamily: 'Microsoft YaHei',
        fontSize: 14,
        fontWeight: 'normal',
        show: true,
      },
    },
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, PieInvest.defaultOptions, options);
    // 处理后数据
    this.seriesData = null;
    this.summary = 0;
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }
  // render函数
  setData(data) {
    const { seriesData, summary } = data;
    this.seriesData = seriesData;
    this.summary = summary;
    this.updateOptions(this.options);
  }
  //更新options
  updateOptions(options) {
    this.options = options;
    if (this.chart) {
      const { series, label, globalStyle } = options;
      this.chart.setOption(
        {
          title: {
            text:
              ((this.seriesData[1].value / this.summary) * 100).toFixed(2) +
              '%',
            subtext: '进资率',
            left: 'center',
            top: '40%',
            textStyle: {
              color: '#FFC44E',
              height: 30,
              fontSize: 20,
            },
          },
          series: [
            {
              type: 'pie',
              color: ['#F1F1F1', '#F1F1F1'],
              data: [1, 2],
              center: [`${globalStyle.center.x}%`, `${globalStyle.center.y}%`],
              radius: [
                `${globalStyle.radius.inner}%`,
                `${globalStyle.radius.outer}%`,
              ],
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
              itemStyle: {
                ...globalStyle.itemStyle,
                borderRadius: 0,
              },
            },
            {
              type: 'pie',
              color: [...series],
              data: this.seriesData,
              center: [`${globalStyle.center.x}%`, `${globalStyle.center.y}%`],
              radius: [
                `${globalStyle.radius.inner}%`,
                `${globalStyle.radius.outer}%`,
              ],
              label: {
                normal: {
                  show: true,
                  position: label.position,
                  formatter: (item) => {
                    const { name, value } = item.data;
                    return `{b|${name}}\n{c|${
                      name === '总投资' ? this.summary : value
                    }万元}`;
                  },
                  rich: {
                    b: {
                      color: label.textStyle.color,
                      fontSize: label.textStyle.fontSize,
                      fontWeight: label.textStyle.fontWeight,
                      height: 30,
                    },
                    c: {
                      color: label.textStyle.color,
                      fontSize: label.textStyle.fontSize * 0.825,
                      fontWeight: 'bold',
                      lineHeight: 5,
                    },
                    f: {
                      color: label.textStyle.color,
                      fontSize: label.textStyle.fontSize * 0.825,
                      fontWeight: 'bold',
                      lineHeight: 5,
                    },
                  },
                },
              },
              labelLine: {
                ...label.labelLine,
                lineStyle: {
                  ...label.labelLine,
                },
              },
              itemStyle: globalStyle.itemStyle,
            },
          ],
        },
        true,
      );
    }
  }

  // 更新view
  updateView() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  // 销毁组件
  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default PieInvest;
