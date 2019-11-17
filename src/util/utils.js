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
        Vue.prototype.$http.post('/role/add',form).then((res)=>{
            console.log(res)
        })
    }
}


export default utils