<template>
  <div class="nav-wrapper">
    <div class="chart-container">
      <div
        class="chart-item"
        v-for="(item, index) in chartsList"
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
  computed: {
    ...mapState('screen', ['chartsList']),
  },
  methods: {
    ...mapActions('chart', ['setCurrentChart']),
  },
};
</script>
<style lang="less" scoped>
.nav-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
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

    &::after {
      content: ' ';
      position: absolute;
      width: 80%;
      height: 1px;
      left: 10%;
      bottom: 0;
      background-color: #1c2139;
    }

    &:hover {
      background-color: #061040;
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
