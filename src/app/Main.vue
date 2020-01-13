<template>
  <div class="main-wrapper">
    <div class="chart">
      <ChartWrapper :grid="gridStatus" />
    </div>
    <div class="panel">
      <ConfigPanel />
    </div>
    <div class="switch">
      <span>网格模式：</span>
      <SwitchInput v-model="gridStatus" />
    </div>
  </div>
</template>
<script>
import ChartWrapper from '../components/ChartWrapper';
import SwitchInput from '../components/SwitchInput';
import ConfigPanel from '../components/ConfigPanel';

import { getGrid, setGrid, removeGrid } from '@/cookie/grid';

export default {
  name: 'main-index',
  components: {
    ChartWrapper,
    SwitchInput,
    ConfigPanel,
  },
  data() {
    return {
      gridStatus: getGrid() ? true : false,
    };
  },
  watch: {
    gridStatus(val) {
      val ? setGrid('grid') : removeGrid();
    },
  },
};
</script>
<style lang="less" scoped>
.main-wrapper {
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  padding: 0 20px;
  .switch {
    position: absolute;
    left: 20px;
    top: 10px;
    span {
      line-height: 3rem;
    }
  }
  .chart {
    flex: 1;
    display: flex;
    justify-content: space-around;
  }
  .panel {
    margin-left: 60px;
    width: 360px;
    height: calc(100% - 40px);
  }
}
</style>
