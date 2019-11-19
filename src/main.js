import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import utils from './util/utils'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(ElementUI)
Vue.prototype.utils = utils
Vue.prototype.$http = axios.create({
  baseURL:'http://beonelife.cn:6001/',//'http://192.168.60.190:11000/',
  timeout:5000
})

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