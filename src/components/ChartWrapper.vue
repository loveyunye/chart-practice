<template>
  <div class="chart-wrapper">
    <div class="chart-wrapper-el" ref="chartParent"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'chart-wrapper',
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    ...mapState('chart', [
      'chartClass',
      'config',
      'defaultOptions',
      'defaultData',
    ]),
  },
  watch: {
    chartClass: {
      handler() {
        this.initChart();
        this.setData(this.defaultData);
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      if (this.chartClass) {
        this.$refs.chartParent.innerHTML = '';
        // 增加子元素
        const chartElement = document.createElement('div');
        chartElement.style.height = `${this.config.height}px`;
        chartElement.style.width = `${this.config.width}px`;
        this.$refs.chartParent.appendChild(chartElement);
        // 初始化
        this.chart = new this.chartClass(chartElement, this.defaultOptions);
        this.chart.initChart();
      }
    },
    setData(data) {
      this.chart.setData(data);
    },
  },
  mounted() {
    this.initChart();
    this.setData(this.defaultData);
  },
};
</script>
