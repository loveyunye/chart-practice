<template>
  <div class="main-wrapper">
    <ChartWrapper />
  </div>
</template>
<script>
import ChartWrapper from '../components/ChartWrapper';
export default {
  name: 'main-index',
  components: {
    ChartWrapper,
  },
};
</script>
<style lang="less" scoped>
.main-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
