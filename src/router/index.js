import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Info from '../components/Info'
import RunInfo from '../components/RunInfo'
import DeviceBand from '../components/DeviceBand'
import DeviceManager from '../components/DeviceManager'
import DeviceSerial from '../components/DeviceSerial'
import DeviceSub from '../components/DeviceSub'
import LogerList from '../components/LogerList'
import OrganList from '../components/OrganList'
import SysManager from '../components/SysManager'
import UserList from '../components/UserList'
import VueAmap from '../components/VueAmap'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{isPubilc:true}
  },
  {
    path: '/map',
    name: 'map',
    component: VueAmap
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect:'/all/info',
    children:[
      {
        path:'/all/info',
        name:'info',
        component:Info,
      },
      {
        path:'/run/info',
        name:'runinfo',
        component:RunInfo
      },
      {
        path:'/device/manager',
        name:'DeviceManager',
        component:DeviceManager
      },
      {
        path:'/device/serial',
        name:'DeviceSerial',
        component:DeviceSerial,
        children:[
          {
            path:'',
            name:'DeviceSub',
            component:DeviceSub,
            alias:'/device/sub'
          },
          {
            path:'/device/band',
            name:'DevicebBand',
            component:DeviceBand,
          }
        ]
      },
      {
        path:'/loger/list',
        name:'LogerList',
        component:LogerList
      },
      {
        path:'/sys/manager',
        name:'SysManager',
        component:SysManager,
        //redirect:'/organ/list',
        children:
        [
          {
            path:'',
            name:'OrganList',
            component:OrganList,
            alias:'/organ/list'
          },
          {
            path:'/user/list',
            naem:'UserList',
            component:UserList
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  if(!to.meta.isPubilc && !localStorage.token){ 
    Vue.prototype.$message({
      type:'error',
      message:'请先登录'
    })
    return next('/login')
  }
    return next()  
})
export default router
