import _Vue from "../main"
import Vue from 'vue'
let utils = {
    getMenu(vm){
            Vue.prototype.$http.get('resource/menuList').then(res=>{
            localStorage.menuList = JSON.stringify(res.data.data)
            let list = JSON.parse(localStorage.menuList)
            vm.menuList = list
            if(list.length>0){
                vm.$router.push(list[0].sourcePath)      //默认跳转权限列表的第一个菜单
            }else{
                _Vue.$message('该用户未授权')
            }
           
        })
    },
    subList(vm,value){
        if(vm.menuList.length==0){
            vm.menuList = JSON.parse(localStorage.menuList)
        }
        let index = vm.menuList.findIndex(item=>item.id === value)
        let list  = vm.menuList[index]
        return list
    },
    getOrganList(vm){
        Vue.prototype.$http.post('organ/list').then(res=>{
            if(!localStorage.organList){
                localStorage.organList = JSON.stringify(res.data.data)
                vm.organList = JSON.parse(localStorage.organList)
            }else{
                vm.organList = res.data.data
            }
            
            
        })
    },
    getRoleList(vm,id){
        Vue.prototype.$http.post(`role/list/${id}`).then(res=>{
            if(!localStorage.roleList){
                localStorage.roleList = JSON.stringify(res.data.data)
                vm.roleList = JSON.parse(localStorage.roleList)
            }else{
                vm.roleList = res.data.data
            }
        })
    },
    addRole(form){
        return Vue.prototype.$http.post('/role/add',form)
    },
    delRole(id){
        return Vue.prototype.$http.delete(`/role/delete/${id}`)
    }, 
      
    editRole(form){
        return Vue.prototype.$http.post(`/role/edit/`,form)
    } ,
    //用户管理
    getUserList(vm,form){
        Vue.prototype.$http.post('user/userList',form).then(res=>{
            localStorage.userList = JSON.stringify(res.data.paging.list)
            vm.userList = JSON.parse(localStorage.userList)
        })
    },
    addUser(vm,form){
        Vue.prototype.$http.post('user/add',form).then(res=>{
            vm.$refs.addTree.clearHandle()
            vm.addUserForm={}
            if(res.data.code===200){
                vm.$message({type:'success',message:'添加用户成功'})
                vm.utils.getUserList(vm,{"pageNum": vm.pageNum,
                "pageSize": vm.pageNum,})
            }
        })
    }, 
    delUser(id){
        return Vue.prototype.$http.delete(`/user/delete/${id}`)
    },
    editUser(form){
        return Vue.prototype.$http.post('/user/edit',form)
    },
    //获取账号订阅信息
    getSubAccount(vm,form){
        Vue.prototype.$http.post('/account/pagerList',form).then(res=>{
           localStorage.subAccountList = JSON.stringify(res.data.paging.list)
           vm.accountList = JSON.parse(localStorage.subAccountList)
        })
    },
    //获取已有订阅账号列表
    //省市区三级
    //获取省级
    getProv(){
        return Vue.prototype.$http.get('/region/firstList')
    },
    //获取市级
    getCity(id){
        return Vue.prototype.$http.get(`/region/secondList/${id}`)
    },
    //获取区级
    getArea(id){
        return Vue.prototype.$http.get(`/region/thirdList/${id}`)
    },
    //设备API
    //获取设备订阅列表
    getbindList(vm,form){
        Vue.prototype.$http.post('/serial/pagerList',form).then(res=>{
            localStorage.bindList = JSON.stringify(res.data.paging.list)
            vm.bindList=JSON.parse(localStorage.bindList)
        })
    },
    //绑定设备
    bindDevice(form){
        return Vue.prototype.$http.post('/serial/bind',form)
    },
    //解绑设备
    UnBindDevice(id){
        return Vue.prototype.$http.post(`/serial/unbind/${id}`)
    },
    //获取设备列表
    getDeviceList(vm,form){
        Vue.prototype.$http.post('/device/pagerList',form).then(res=>{
            localStorage.deviceList = JSON.stringify(res.data.paging.list)
            vm.deviceList = JSON.parse(localStorage.deviceList)
        })
    },
    //获取设备操作日志
    getLogger(vm,form){
        Vue.prototype.$http.post('/logger/pagerList',form).then(res=>{
            localStorage.logList = JSON.stringify(res.data.paging.list)
            vm.logList = JSON.parse(localStorage.logList)
            if(res.data.code===200){
                vm.$message({type:'success',message:'查询成功'})
            }
        })
    },
    //获取设备组信息
    getDeviceGroup(vm,num){
        Vue.prototype.$http.post(`/device/deviceGroup/${num}`).then(res=>{
            vm.deviceInfo = res.data.data
            //vm.groupInfoList = vm.deviceInfo.groupInfoList
        })
    },
    //获取树型数据的指定属性集合
    getAllNode(arr,childName){
        
        const arrs = []
        if (!arr) {
          return
        }
        if (!childName) {
          childName = 'children'
        }
        const getChild = (arr) => {
          for (let i = 0; i < arr.length; i++) {
            arrs.push(arr[i])
            if (arr[i][childName] && arr[i][childName].length > 0) {
              getChild(arr[i][childName])
            }
          }
          
          return arrs
        }
        return getChild(arr)
      }
      
}


export default utils