<template>
  <div class="main-wrapper"></div>
</template>
<script>
export default {
  name: 'main-index',
  methods: {
    async initCharts() {
      const { default: Chart } = await import('../charts/PiePercentage');
      const chart = new Chart(this.$el);
      chart.initChart();
      // chart.setData(0.8);
      chart.setData([
        {
          name: '12-21',
          value: 123,
        },
        {
          name: '12-22',
          value: 123,
        },
        {
          name: '12-23',
          value: 123,
        },
        {
          name: '12-25',
          value: 123,
        },
      ]);
    },
  },
  mounted() {
    this.initCharts();
  },
};
</script>
<style lang="less" scoped>
.main-wrapper {
  height: 100%;
}
</style>
