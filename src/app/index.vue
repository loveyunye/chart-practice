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
import MetroApi from '../api/http';

export default {
  name: 'layout',
  components: {
    NavSide,
    Head,
    Main,
  },
  mounted() {
    MetroApi({
      url: '/api/login',
      method: 'post',
      data: {
        username: 'superAdmin',
        password: '123456',
      },
    });
    MetroApi({
      url: '/api/user',
      method: 'get',
    });
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
      overflow-x: scroll;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 2px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 1px;
        // box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
        background: #409eff;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0);
      }
    }
  }
}
</style>
