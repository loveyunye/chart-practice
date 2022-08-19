<template>
  <div class="test-wrapper">
    <div class="work-content">
      <canvas ref="way" id="way"></canvas>
      <canvas ref="rules" id="rules"></canvas>
    </div>
  </div>
</template>
<script>
// import Ruler from './ruler.js';
import Way from './way.js';

export default {
  data() {
    return {};
  },
  mounted() {
    // this.ruler = new Ruler(this.$refs.rules);
    // this.ruler.draw(1);

    this.way = new Way(this.$refs.way);
    this.way.draw();
  },
};
</script>
<style lang="less" scoped>
.test-wrapper {
  height: 100vh;
  background-color: #001155;
  .work-content {
    padding-top: 20px;
    overflow-x: auto;
    #way {
      width: 1200px;
      height: 200px;
      margin-bottom: 8px;
    }
    #rules {
      width: 1200px;
      height: 48px;
      // background-color: #fff;
    }
  }
}
</style>
