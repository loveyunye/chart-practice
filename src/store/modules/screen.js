const screen = {
  namespaced: true,
  state: {
    chartsList: [],
  },
  mutations: {
    setChartList(state, res) {
      state.chartsList = res;
    },
  },
  actions: {
    listHandler({ commit }, res) {
      commit('setChartList', res);
    },
  },
};

export default screen;
