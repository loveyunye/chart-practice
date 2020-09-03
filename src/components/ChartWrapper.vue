<template>
  <div :class="chartWrapper">
    <div class="chart-wrapper-el" ref="chartParent"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'chart-wrapper',
  props: {
    grid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    ...mapState('chart', [
      'chartClass',
      'config',
      'currentOptions',
      'currentData',
      'fromPanel',
    ]),
    chartWrapper() {
      return {
        'chart-wrapper': true,
        grid: this.grid,
      };
    },
  },
  watch: {
    chartClass: {
      handler() {
        this.initChart();
        this.setData(this.currentData);
      },
      deep: true,
    },
    currentData: {
      handler() {
        if (this.fromPanel) {
          this.setData(this.currentData);
        }
      },
      deep: true,
    },
    currentOptions: {
      handler() {
        if (this.fromPanel) {
          this.initChart();
          this.setData(this.currentData);
        }
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      if (this.chartClass) {
        if (this.chart && this.chart.destroy) {
          this.chart.destroy();
        }
        this.$refs.chartParent.innerHTML = '';
        // 增加子元素
        const chartElement = document.createElement('div');
        chartElement.style.height = `${this.config.height}px`;
        chartElement.style.width = `${this.config.width}px`;
        this.$refs.chartParent.appendChild(chartElement);
        // 初始化
        this.chart = new this.chartClass(chartElement, this.currentOptions);
        this.chart.initChart();
      }
    },
    setData(data) {
      if (this.chart) {
        this.chart.setData(data);
      }
    },
  },
  mounted() {
    this.initChart();
    this.setData(this.currentData);
  },
};
</script>
<style lang="less" scoped>
.chart-wrapper {
  display: inline-block;
  &.grid {
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.2) 1px,
        transparent 0
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 0),
      linear-gradient(rgba(255, 255, 255, 0.2) 2px, transparent 0),
      linear-gradient(90deg, rgba(255, 255, 255, 0.2) 2px, transparent 0);
    background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
    background-position: -0.5px -0.5px, -0.5px -0.5px, -1px -1px, -1px -1px;
    position: relative;
    // &:before {
    //   position: absolute;
    //   content: ' ';
    //   width: 2px;
    //   height: 100%;
    //   top: 0;
    //   left: 50px;
    //   background-color: rgba(255, 255, 255, 0.3);
    // }

    // &:after {
    //   position: absolute;
    //   content: ' ';
    //   width: 100%;
    //   height: 2px;
    //   top: 50px;
    //   left: 0;
    //   background-color: rgba(255, 255, 255, 0.3);
    // }
  }
}
</style>
