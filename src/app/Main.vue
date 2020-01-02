<template>
  <div class="main-wrapper">
    <ChartWrapper :grid="gridStatus" />
    <div class="switch">
      <span>网格模式：</span>
      <SwitchInput v-model="gridStatus" />
    </div>
  </div>
</template>
<script>
import ChartWrapper from '../components/ChartWrapper';
import SwitchInput from '../components/SwitchInput';
export default {
  name: 'main-index',
  components: {
    ChartWrapper,
    SwitchInput,
  },
  data() {
    return {
      gridStatus: false,
    };
  },
};
</script>
<style lang="less" scoped>
.main-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  .switch {
    position: absolute;
    left: 20px;
    top: 10px;
    span {
      line-height: 3rem;
    }
  }
}
</style>
