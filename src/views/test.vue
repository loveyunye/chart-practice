<template>
  <div class="test-wrapper">
    <canvas id="gap" ref="gap"></canvas>
    <div class="work-content">
      <canvas ref="way" id="way"></canvas>
      <canvas ref="rules" id="rules"></canvas>
    </div>
  </div>
</template>
<script>
import Ruler from './ruler.js';
import Way from './way.js';
import Gap from './gap.js';

export default {
  data() {
    return {};
  },
  mounted() {
    this.ruler = new Ruler(this.$refs.rules);
    this.ruler.draw();

    this.way = new Way(this.$refs.way);
    this.way.draw();

    this.gap = new Gap(this.$refs.gap);
    this.gap.draw();
  },
};
</script>
<style lang="less" scoped>
.test-wrapper {
  height: 100vh;
  background-color: #001155;

  #gap {
    width: 100%;
    height: 40px;
  }
  .work-content {
    overflow-x: auto;
    #way {
      width: 1200px;
      min-width: 100%;
      height: 200px;
      margin-bottom: 8px;
    }
    #rules {
      width: 1200px;
      min-width: 100%;
      height: 48px;
      // background-color: #fff;
    }
  }
}
</style>
