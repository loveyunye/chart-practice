import { cloneDeep } from 'lodash';
const screen = {
  namespaced: true,
  state: {
    chartClass: null,
    config: null,
    defaultOptions: null,
    defaultData: null,
    key: '',
  },
  mutations: {
    setCurrentChart(state, current) {
      console.log(current);
      state.chartClass = current.chart;
      state.defaultOptions = cloneDeep(current.chart.defaultOptions || {});
      state.defaultData = cloneDeep(current.config.data);
      state.config = cloneDeep(current.config);
      state.key = current.key;
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
