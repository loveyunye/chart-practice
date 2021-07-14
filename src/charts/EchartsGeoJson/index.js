import echarts from 'echarts';
import { deepMerge } from '../../utils';

// 基础柱状图
class EchartGeoJson {
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
      fontSize: 16,
    },
    yAxisLabel: {
      color: '#ddd',
      fontSize: 16,
    },
    barWidth: 32,
    splitNumber: 5,
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, EchartGeoJson.defaultOptions, options);
  }
  async initChart() {
    // import('./New_Shapefile.json').then((res) => {
    //   // console.log(res.default);
    // });
    // const json = await import('./New_Shapefile.json');
    // console.log(json);
    if (!this.chart) {
      // echarts.registerMap('北京', json.default);
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    this.chart.setOption({
      title: {
        text: '通州区各镇人口密度图',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (个)',
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'left',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      visualMap: {
        min: 0,
        max: 2000,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
      },
      series: [
        {
          name: '通州区各镇',
          type: 'map',
          map: '北京', // 自定义扩展图表类型
          aspectScale: 1.0, //长宽比. default: 0.75
          zoom: 1.1,
          roam: true,
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } },
          },
          data: [], //需要动态加载data内容
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

export default EchartGeoJson;
