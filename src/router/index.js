import Vue from 'vue'
import VueRouter from 'vue-router'
import LargeScreen from '../components/largeScreen.vue'


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LargeScreen',
    component: LargeScreen
  }

];

const router = new VueRouter({
  routes
});

router.beforeEach((to,from,next)=>{
  next();
});

export default router
