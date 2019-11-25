import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import utils from './util/utils'
import Router from 'vue-router'
import VueAMap from 'vue-amap';

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '632fc907671acd23df063076928b7747',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(ElementUI)
Vue.prototype.utils = utils
Vue.prototype.$http = axios.create({
  baseURL:'http://192.168.60.190:11000/',//'http://192.168.60.190:11000/',http://beonelife.cn:6001/
  timeout:5000
})

//引入echarts
var echarts = require('echarts');
Vue.prototype.$echarts = echarts;

//响应拦截
Vue.prototype.$http.interceptors.response.use(res=>{
    if(res.data.code===500){
      Vue.prototype.$message({
        type:'error',
        message:res.data.message
      })
    }else{
      return res
    }
})

//请求拦截
Vue.prototype.$http.interceptors.request.use(
  config => {
      if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
          config.headers["x-user-token"] = `${localStorage.token}`;
      }
      return config;
  },
  err => {
      return Promise.reject(err);
  });

Vue.config.productionTip = false

const _Vue = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export default _Vue;