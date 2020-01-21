import { cloneDeep, isEqual } from 'lodash';
import { setKey } from '@/cookie/key';

const screen = {
  namespaced: true,
  state: {
    chartClass: null,
    config: null,
    defaultOptions: null,
    currentOptions: null,
    defaultData: null,
    currentData: null,
    key: '',
    fromPanel: false,
  },
  mutations: {
    setCurrentChart(state, current) {
      state.chartClass = current.chart;
      state.fromPanel = false;
      // 默认配置
      state.defaultOptions = cloneDeep(current.chart.defaultOptions || {});
      state.defaultData = cloneDeep(current.config.data);

      // 当前配置
      state.currentOptions = cloneDeep(current.chart.defaultOptions || {});
      state.currentData = cloneDeep(current.config.data);

      state.config = cloneDeep(current.config);
      state.key = current.key;
      setKey(current.key);
    },
    // 设置当前配置
    setCurrentOptions(state, current) {
      if (!isEqual(state.currentOptions, current)) {
        state.fromPanel = true;
        state.currentOptions = cloneDeep(current);
      }
    },
    // 设置当前数据
    setCurrentData(state, current) {
      if (!isEqual(state.currentData, current)) {
        state.fromPanel = true;
        state.currentData = cloneDeep(current);
      }
    },
  },
  actions: {
    setCurrentChart({ commit, state }, current) {
      if (state.key !== current.key && current) {
        commit('setCurrentChart', current);
      }
    },
  },
};

export default screen;
