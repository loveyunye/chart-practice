<template>
  <div class="config-panel-wrapper">
    <div class="nav">
      <div
        :class="{
          'nav-item': true,
          active: item.key === active,
        }"
        @click="active = item.key"
        v-for="item in actives"
        :key="item.key"
      >
        {{ item.name }}
      </div>
    </div>
    <div :class="`container ${active}`">
      <div class="container-relative">
        <div
          class="option config-main"
          :style="{ zIndex: active === 'options' ? 1 : 0 }"
        >
          <OptionsWrapper />
        </div>
        <div
          class="data config-main"
          :style="{ zIndex: active === 'data' ? 1 : 0 }"
        >
          <DataWrapper />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DataWrapper from './DataWrapper';
import OptionsWrapper from './OptionsWrapper';

export default {
  name: 'config-panel',
  data() {
    return {
      active: 'options',
      actives: [
        {
          name: '配置',
          key: 'options',
        },
        {
          name: '数据',
          key: 'data',
        },
      ],
    };
  },
  components: {
    DataWrapper,
    OptionsWrapper,
  },
};
</script>
<style lang="less" scoped>
.config-panel-wrapper {
  width: 100%;
  height: 100%;
  .nav {
    height: 40px;
    line-height: 40px;
    display: flex;
    .nav-item {
      font-size: 1.4rem;
      width: 50%;
      text-align: center;
      background-color: #212844;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      &:not(.active) {
        box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.1);
        background-color: rgba(33, 40, 68, 0.5);
        color: #ccc;
      }
    }
  }
  .container {
    height: calc(100% - 40px);
    background-color: #212844;
    box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
    &.config {
      border-radius: 0 8px 8px 8px;
    }
    &.data {
      border-radius: 8px 0 8px 8px;
    }

    .container-relative {
      position: relative;
      height: 100%;
    }
    .config-main {
      position: absolute;
      background-color: #212844;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      padding-right: 10px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 1px;
        // box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
        background: #409eff;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
        border-radius: 10px;
        background: rgba(0, 0, 0, 0);
      }
    }
  }
}
</style>
