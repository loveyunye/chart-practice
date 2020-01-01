import cloneDeep from 'lodash.clonedeep';
const screen = {
  namespaced: true,
  state: {
    chartClass: null,
    config: null,
    defaultOptions: null,
    key: '',
  },
  mutations: {
    setCurrentChart(state, current) {
      state.chartClass = cloneDeep(current.chart);
      state.defaultOptions = cloneDeep(current.chart.defaultOptions || {});
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
