// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import utils from './libs/utils'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(VueResource);
Vue.use(iView);
Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    activeName: '1-1',
    userInfo: {
      username: '',
      token: ''
    },
    isLogin:'fdfd',
    autoLogin: false,
    openName: []
  },
  mutations: {
    /*login(state,n){
      let isLogin = JSON.parse(n);
      localStorage.setItem('isLogin',JSON.stringify(isLogin));
      console.log(isLogin);
      state.isLogin = isLogin;
    },*/
    updatePathName(state, payload) {
      let pathName = window.location.hash.split('#')[1];
      if (pathName.indexOf('?') !== -1) {
        pathName = pathName.split('?')[0];
      }
      switch (pathName) {
        case '/task/management':
          state.activeName = '1-1';
          break;
        case '/task/rule':
          state.activeName = '1-2';
          break;
        case '/constraint/management':
          state.activeName = '2-1';
          break;
        case '/constraint/rule':
          state.activeName = '2-2';
          break;
        case '/prize/pool':
          state.activeName = '3-1';
          break;
        case '/coupon/pool':
          state.activeName = '3-2';
          break;
        case '/prize/type':
          state.activeName = '3-3';
          break;
        case '/prize/compensate':
          state.activeName = '3-4';
          break;
        case '/project':
          state.activeName = '4-1';
          break;
        case '/task/promotion':
          state.activeName = '5-1';
          break;
        case '/scene':
          state.activeName = '6-1';
          break;
        case '/task/count':
          state.activeName = '7-1';
          break;
        case '/prize/count':
          state.activeName = '7-2';
          break;
        case '/task/record':
          state.activeName = '8-1';
          break;
        case '/task/vip':
          state.activeName = '8-2';
          break;
        case '/prize/real':
          state.activeName = '8-3';
          break;
        case '/coupon/card':
          state.activeName = '8-4';
          break;
        case '/coupon/qrcode':
          state.activeName = '8-5';
          break;
        case '/prize/record':
          state.activeName = '8-6';
          break;
        case '/log/handle':
          state.activeName = '8-7';
          break;
        case '/log/yunzuan':
          state.activeName = '8-8';
          break;
        case '/log/new':
          state.activeName = '8-9';
          break;
        case '/log/coupon':
          state.activeName = '8-10';
          break;
        case '/log/star':
          state.activeName = '8-11';
          break;
        case '/log/mail':
          state.activeName = '8-12';
          break;
        case '/log/vip':
          state.activeName = '8-13';
          break;
        case '/log/allowance':
          state.activeName = '8-14';
          break;
        case '/system':
          state.activeName = '8-15';
          break;
        case '/sign/management':
          state.activeName = '9-1';
          break;
        case '/sign/timing':
          state.activeName = '9-2';
          break;
        case '/interface':
          state.activeName = '10-1';
          break;
        case '/redis':
          state.activeName = '11-1';
          break;
        default:
          state.activeName = '100-1';
      }
      state.openName = [state.activeName.split('-')[0]];
    },
    updateUserInfo(state, payload) {
      state.userInfo.username = payload.username;
      state.userInfo.token = payload.token;
    },
    updateAutoLogin(state, payload) {
      state.autoLogin = payload.autoLogin;
    }
  }
});
// 全局路由守卫
router.beforeEach((to, from, next) => {
  store.commit('updatePathName');
  utils.setTitle(to.meta.title || '任务系统管理后台');
  next();
  /*if(JSON.parse(localStorage.getItem('isLogin'))){
    store.commit('updatePathName');
    utils.setTitle(to.meta.title || '任务系统管理后台');
    next();
  }else {
    next({
      path:'/login'
    })
  }
  if(to.fullPath === '/login'){
    if(JSON.parse(localStorage.getItem('isLogin'))){
      next({
        path:from.fullPath
      })
    }else {
      next();
    }
  }*/
});

router.afterEach(route => {

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
