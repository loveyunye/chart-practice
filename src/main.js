import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@/assets/style/normalize.css';
import '@/assets/style/reset.css';
// import './promise';
import store from '@/store';
import '@/charts/globalCharts';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
