import { deepMerge } from '@/utils';
import echarts from 'echarts';

/**
 * 仪表盘看板
 */
class DashboardPanel {
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, DashboardPanel.defaultOptions, options);
    // 初始化时生成echarst对象
    this.chart = echarts.init(this.container);
    // 存储seriesData
    this.seriesData = null;
  }
  static defaultOptions = {
    series: [
      {
        globalConfig: {
          startAngle: 220,
          endAngle: 45,
          radius: 38,
          centerX: 24,
          centerY: 50,
          min: 0,
          max: 1000,
        },
        axisLine: { width: 2, color: '#1b8586' },
        axisTick: { color: '#1b8586', width: 2, splitNumber: 8, length: -5 },
        splitLine: { color: '#1b8586', width: 2, length: -15 },
        axisLabel: {
          fontSize: 10,
          fontWight: 500,
          color: '#ffffff',
          distance: -15,
        },
        point: { color: '#09c2c0' },
        value: { fontSize: 20, fontWight: 500, color: '#ff7705', dy: 50 },
        innerArc: { radius: 32, color: '#ffffff', width: 2 },
        title: {
          left: 20,
          bottom: 30,
          fontWeight: 500,
          fontSize: 16,
          color: '#fff',
        },
      },
      {
        globalConfig: {
          startAngle: 200,
          endAngle: -20,
          radius: 38,
          centerX: 50,
          centerY: 50,
          min: 0,
          max: 1000,
        },
        axisLine: { color: '#1b8586', width: 2 },
        axisTick: { color: '#1b8586', width: 2, splitNumber: 8, length: -5 },
        splitLine: { color: '#1b8586', width: 2, length: -15 },
        axisLabel: {
          fontSize: 10,
          fontWight: 500,
          color: '#ffffff',
          distance: -15,
        },
        point: { color: '#09c2c0' },
        value: { fontSize: 20, fontWight: 500, color: '#ff7705', dy: 50 },
        innerArc: { radius: 32, color: '#ffffff', width: 2 },
        title: {
          left: 10,
          bottom: 30,
          fontWeight: 500,
          fontSize: 16,
          color: '#fff',
        },
      },
      {
        globalConfig: {
          startAngle: 140,
          endAngle: -45,
          radius: 38,
          centerX: 76,
          centerY: 50,
          min: 0,
          max: 1000,
        },
        axisLine: { color: '#1b8586', width: 2 },
        axisTick: { color: '#1b8586', width: 2, splitNumber: 8, length: -5 },
        splitLine: { color: '#1b8586', width: 2, length: -15 },
        axisLabel: {
          fontSize: 10,
          fontWight: 500,
          color: '#ffffff',
          distance: -15,
        },
        point: { color: '#09c2c0' },
        value: { fontSize: 20, fontWight: 500, color: '#ff7705', dy: 50 },
        innerArc: { radius: 32, color: '#ffffff', width: 2 },
        title: { bottom: 30, fontWeight: 500, fontSize: 16, color: '#fff' },
      },
    ],
  };

  initChart() {}
  // render函数
  render(data) {
    this.updateData(data);
  }
  //更新options
  updateOptions(options) {
    if (this.seriesData && Array.isArray(this.seriesData)) {
      const { series } = options;
      //高危攻击
      if (this.chart) {
        const option = {
          title: [
            ...series
              .filter((item, index) => this.seriesData[index])
              .map((item, index) => {
                const { title, globalConfig } = item;
                return {
                  left: `${globalConfig.centerX - 0.5}%`,
                  bottom: `${title.bottom}%`,
                  text: this.seriesData[index].label,
                  textStyle: {
                    ...title,
                  },
                  textAlign: 'middle',
                };
              }),
          ],
          series: [
            // 刻度
            ...series
              .filter((item, index) => this.seriesData[index])
              .map((item) => {
                const {
                  globalConfig,
                  axisLine,
                  axisTick,
                  splitLine,
                  axisLabel,
                } = item;
                return {
                  type: 'gauge',
                  ...globalConfig,
                  center: [
                    `${globalConfig.centerX}%`,
                    `${globalConfig.centerY}%`,
                  ],
                  radius: `${globalConfig.radius}%`,
                  splitNumber: 10, //刻度数量
                  clockwise: true,
                  axisLine: {
                    show: true,
                    lineStyle: {
                      width: axisLine.width,
                      shadowBlur: 0,
                      color: [[1, axisLine.color]],
                    },
                  },
                  axisTick: {
                    ...axisTick,
                    lineStyle: {
                      ...axisTick,
                    },
                  },
                  splitLine: {
                    ...splitLine,
                    lineStyle: {
                      ...splitLine,
                    },
                  },
                  axisLabel: {
                    ...axisLabel,
                    textStyle: {
                      ...axisLabel,
                    },
                  },
                  pointer: {
                    //仪表盘指针
                    show: 0,
                  },
                  detail: {
                    show: false,
                  },
                  data: [
                    {
                      name: '',
                      value: globalConfig.max,
                    },
                  ],
                };
              }),
            // 指针、值
            ...series
              .filter((item, index) => this.seriesData[index])
              .map((item, index) => {
                const { globalConfig, point, value } = item;
                return {
                  type: 'gauge',
                  ...globalConfig,
                  center: [
                    `${globalConfig.centerX}%`,
                    `${globalConfig.centerY}%`,
                  ],
                  radius: `${globalConfig.radius}%`,
                  clockwise: true,
                  axisLine: {
                    show: false,
                  },
                  axisTick: {
                    show: false,
                  },
                  splitLine: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                  pointer: {
                    show: true,
                    width: 5,
                  },
                  detail: {
                    show: true,
                    offsetCenter: [0, `${value.dy}%`],
                    textStyle: {
                      ...value,
                    },
                  },
                  itemStyle: {
                    normal: {
                      color: point.color,
                    },
                  },
                  data: [
                    {
                      value: this.seriesData[index].value,
                    },
                  ],
                };
              }),
            // 内圈
            ...series
              .filter((item, index) => this.seriesData[index])
              .map((item) => {
                const { globalConfig, innerArc } = item;
                return {
                  type: 'gauge',
                  ...globalConfig,
                  center: [
                    `${globalConfig.centerX}%`,
                    `${globalConfig.centerY}%`,
                  ],
                  radius: `${innerArc.radius}%`,
                  clockwise: true,
                  // axisLine: axisLineZhou, // 坐标轴线  ,
                  axisLine: {
                    lineStyle: {
                      width: innerArc.width,
                      color: [[1, innerArc.color]],
                    },
                  },
                  axisTick: {
                    show: false,
                  },
                  splitLine: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                  detail: {
                    show: false,
                  },
                };
              }),
          ],
        };
        this.chart.setOption(option);
      }
    }
  }

  //更新data
  updateData(data) {
    if (data) {
      this.seriesData = data;
      this.updateOptions(this.options);
    }
  }

  // 更新数据
  setData(data) {
    if (data) {
      this.seriesData = data;
      this.updateOptions(this.options);
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

export default DashboardPanel;
