import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../app/index.vue';
import mapDot from '../views/mapDot';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout,
  },
  {
    path: '/mapDot',
    name: 'mapDot',
    component: mapDot,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
