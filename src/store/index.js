import Vue from 'vue';
import Vuex from 'vuex';
import screen from './modules/screen';
import chart from './modules/chart';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    screen,
    chart,
  },
});

export default store;
