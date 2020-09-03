<template>
  <div class="main-wrapper">
    <div class="chart">
      <ChartWrapper :grid="grid" :rule="rule" />
    </div>
    <div class="panel" :class="pure ? 'pure' : ''">
      <ConfigPanel />
    </div>
    <div class="switch">
      <div class="switch-item">
        <span>网格：</span>
        <SwitchInput :value="grid" @input="setGrid" />
      </div>
      <div class="switch-item">
        <span>标尺：</span>
        <SwitchInput :value="rule" @input="setRule" />
      </div>
      <div class="switch-item">
        <span>纯净：</span>
        <SwitchInput :value="pure" @input="setPure" />
      </div>
    </div>
  </div>
</template>
<script>
import ChartWrapper from '../components/ChartWrapper';
import SwitchInput from '../components/SwitchInput';
import ConfigPanel from '../components/ConfigPanel';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'main-index',
  components: {
    ChartWrapper,
    SwitchInput,
    ConfigPanel,
  },
  computed: {
    ...mapState('screen', ['pure', 'grid', 'rule']),
  },
  methods: {
    ...mapMutations('screen', ['setPure', 'setGrid', 'setRule']),
  },
};
</script>
<style lang="less" scoped>
.main-wrapper {
  height: 100%;
  display: flex;
  position: relative;
  overflow-x: scroll;
  align-items: center;
  padding: 0 20px;
  .switch {
    position: absolute;
    left: 20px;
    top: 10px;
    span {
      line-height: 3rem;
    }
    .switch-item {
      margin-bottom: 10px;
    }
  }
  .chart {
    flex: 1;
    display: flex;
    justify-content: space-around;
  }
  .panel {
    margin-left: 60px;
    min-width: 360px;
    width: 360px;
    height: calc(100% - 40px);
    transition: all 0.2s;

    &.pure {
      width: 0;
      min-width: 0;
      overflow: hidden;
      margin-left: 0;
    }
  }
}
</style>
