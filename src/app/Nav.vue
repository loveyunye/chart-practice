<template>
  <div class="nav-wrapper">
    <div class="chart-types">
      <div
        class="type-item"
        :class="{ active: currentType === item.type }"
        v-for="item in chartTypes"
        :key="item.type"
        @click="selectType(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="chart-container">
      <div
        :class="`chart-item ${key === item.key ? 'active' : ''}`"
        v-for="(item, index) in currentChartsList"
        :key="item.config.name + index"
        @click="setCurrentChart(item)"
      >
        <img :src="item.icon" alt="" />
        <div>
          <span>{{ item.config.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      chartTypes: [
        { name: '柱状图', type: 'bar' },
        { name: '折线图', type: 'line' },
        { name: '饼图', type: 'pie' },
        { name: '进度图', type: 'dashboard' },
        { name: '地图', type: 'map' },
        { name: '其它', type: 'other' },
      ],
    };
  },
  computed: {
    ...mapState('screen', ['chartsList']),
    ...mapState('chart', ['key']),
    currentType() {
      return this.key.split('-')[0];
    },
    currentChartsList() {
      return this.chartsList.filter((i) => {
        const type = i.key.split('-')[0];
        return type === this.currentType;
      });
    },
  },
  methods: {
    ...mapActions('chart', ['setCurrentChart']),
    selectType(type) {
      const list = this.chartsList.filter((i) => {
        return type === i.key.split('-')[0];
      });
      if (list.length > 0) {
        this.setCurrentChart(list[0]);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.nav-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  .chart-types {
    width: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    flex-wrap: nowrap;
    overflow-y: auto;
    .type-item {
      cursor: pointer;
      padding-top: 10px;
      width: 30px;
      writing-mode: vertical-lr;
      text-align: center;
      height: 100px;
      min-height: 100px;
      font-size: 16px;
      background-color: #0078ff;
      margin-bottom: 10px;
      border-radius: 2px;
      letter-spacing: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      opacity: 0.1;
      &:hover {
        opacity: 0.5;
      }
      &.active {
        opacity: 1;
      }
    }
  }
  .chart-container {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
  overflow-x: hidden;
  background: #212844;
  box-shadow: 0px 11px 21px 10px rgba(0, 0, 0, 0.2);
  .chart-item {
    display: flex;
    position: relative;
    height: 70px;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.5s;
    border-radius: 2px;

    &:hover {
      background-color: #061040;
    }
    &.active {
      background-color: #945be0;
    }

    &::after {
      content: ' ';
      position: absolute;
      width: 80%;
      height: 1px;
      left: 10%;
      bottom: 0;
      display: none;
      background-color: #1c2139;
    }
    img {
      width: 50px;
      height: 40px;
      object-fit: cover;
      margin-right: 10px;
    }
    div {
      font-size: 1.4rem;
      line-height: 2rem;
    }
  }
}
</style>
