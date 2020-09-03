const screen = {
  namespaced: true,
  state: {
    chartsList: [],
    pure: false,
    grid: false,
  },
  mutations: {
    setChartList(state, res) {
      state.chartsList = res;
    },
    setPure(state, pure) {
      state.pure = pure;
    },
    setGrid(state, grid) {
      state.grid = grid;
    },
  },
  actions: {
    listHandler({ commit }, res) {
      commit('setChartList', res);
    },
  },
};

export default screen;
