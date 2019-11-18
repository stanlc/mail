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
    //用户管理
    getUserList(vm,form){
        Vue.prototype.$http.post('user/userList',form).then(res=>{
            localStorage.userList = JSON.stringify(res.data.paging.list)
            vm.userList = JSON.parse(localStorage.userList)
        })
    },
    addUser(vm,form){
        Vue.prototype.$http.post('user/add',form).then(res=>{
            console.log(res.data)
        })
    }, 
    delUser(id){
        return Vue.prototype.$http.delete(`/user/delete/${id}`)
    },  
    editUser(form){
        return Vue.prototype.$http.post(`/user/edit/`,form)
    } ,
    //获取账号订阅信息
    getSubAccount(vm,form){
        Vue.prototype.$http.post('/account/pagerList',form).then(res=>{
            localStorage.subAccountList = JSON.stringify(res.data.paging.list)
            vm.accountList = JSON.parse(localStorage.subAccountList)
        })
    }
}


export default utils