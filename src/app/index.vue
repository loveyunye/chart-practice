<template>
  <div class="layout-wrapper">
    <Head />
    <div class="body">
      <div class="side">
        <NavSide />
      </div>
      <div class="main">
        <Main />
      </div>
    </div>
  </div>
</template>
<script>
import NavSide from './Nav';
import Head from './Head';
import Main from './Main';
export default {
  name: 'layout',
  components: {
    NavSide,
    Head,
    Main,
  },
};
</script>
<style lang="less" scoped>
.layout-wrapper {
  height: 100vh;
  width: 100vw;
  min-height: 500px;
  // overflow-y: scroll;
  overflow: hidden;
  .body {
    display: flex;
    justify-content: space-between;
    background-color: #2a3659;
    height: calc(100% - 70px);
    .side {
      width: 200px;
      height: 100%;
    }
    .main {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
