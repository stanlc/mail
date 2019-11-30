<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>用户管理</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="用户名称：">
                    <el-input v-model="searchForm.nickName" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="登录名称：">
                    <el-input v-model="searchForm.userName" placeholder="请输入登录名称"></el-input>
                </el-form-item> 
                <el-form-item label="手机号：">
                    <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：" >
                    <el-input v-model="searchForm.email" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>               
                <el-form-item>
                    <el-button type="primary" @click="searchUser">查询</el-button>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form>
                <el-button type="primary" @click="openAdd">新增用户</el-button>
                <el-button type="danger" @click="delUser">删除</el-button>
            </el-form>
            <el-table
            :data="tabelList"
            style="width: 100%"
            @select="userSelect"
            @check-change="CheckChange"
                :height="tableHeight"
                ref="table"
            >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="序号"
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                label="用户名称"
                prop="nickName"
                >
                </el-table-column>
                <el-table-column
                label="登录名称"
                prop="userName"
                >
                </el-table-column>
                <el-table-column
                label="所属角色"
                prop="roleName"
                >
                </el-table-column>
                <el-table-column
                label="手机号码"
                prop="phone"
                :formatter="phoneFormat"
                >
                </el-table-column>
                <el-table-column
                label="电子邮箱"
                prop="email"
                width="160px"
                >
                </el-table-column>
                <el-table-column
                label="机构名称"
                prop="organName"
                >
                </el-table-column>
                <el-table-column
                label="创建时间"
                prop="createTime"
                :formatter="formatTime"
                width="180"
                >
                </el-table-column>                                  
                <el-table-column
                label="操作"
                width="200"
                >
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="delUserC(scope.row)">删除</el-button>
                    </template>                
                </el-table-column>                                
            </el-table>
            <!-- 编辑用户Dialog -->
            <el-dialog
            title="编辑用户"
            :visible.sync="editUserVisible"
            width="35%"
            
            >
            <el-form label-position="right"  label-width="90px" :inline="true">
                    <el-form-item label="机构名称：" >
                        <select-tree
                        :props="props"
                        :options="organList"
                        :value="editOrganId"
                        ref="editTree"
                        @getValue="getEditValue($event)"
                        v-model="editUserForm.organId"
                        ></select-tree>
                    </el-form-item>
                    <el-form-item label="所属角色：">
                        <el-select v-model="editUserForm.roleName" @change="changeEditRole"> 
                            <el-option v-for="item in userRoleList" :key="item.index" :label="item.roleName" :value="item.roleName"></el-option>
                        </el-select>
                    </el-form-item>      
                    <el-form-item label="用户名称：">
                        <el-input v-model="editUserForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="登录名称：">
                        <el-input v-model="editUserForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件：">
                        <el-input v-model="editUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：">
                        <el-input v-model="editUserForm.phone"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="editUser">提交</el-button>
                    <el-button type="primary" @click="editUserVisible=false;$refs.editTree.clearHandle()">取消</el-button>
            </span>
            </el-dialog>
            <!-- 编辑用户Dialog --> 
            <!-- 添加用户Dialog -->
            <el-dialog
            title="新增用户"
            :visible.sync="addUserVisible"
            width="38%"
            class="add"
            @close="clearValidate('addUserForm')"
            >           
            <el-form label-position="right"  label-width="100px" :model="addUserForm" :inline="true" :rules="rules" ref="addUserForm">
                <el-form-item label="机构名称：" >
                    <select-tree
                    :props="props"
                    :options="organList"
                    :value="valueId"
                    ref="addTree"
                    @getValue="getValue($event)"
                    v-model="addUserForm.organId"
                    ></select-tree>
                </el-form-item>
                <el-form-item label="所属角色：">
                    <el-select v-model="selectRole" @change="changeRole"> 
                        <el-option v-for="item in userRoleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>     
                    <el-form-item label="用户名称：" prop="nickName">
                        <el-input v-model="addUserForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="登录名称：" prop="userName">
                        <el-input v-model="addUserForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件：" prop="email">
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop="phone">
                        <el-input v-model="addUserForm.phone"></el-input>
                    </el-form-item>
            </el-form >
            <span slot="footer" class="dialog-footer">
                <el-form :inline="true">
                        <el-form-item>
                            <el-button type="primary" @click="addUser">添加</el-button>
                        </el-form-item><el-form-item>
                            <el-button type="primary" @click="cancelAdd">取消</el-button>
                        </el-form-item>
                </el-form>
            </span>
            </el-dialog>
            <!-- 添加用户Dialog -->                          
        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15,20]"
            :page-size="pagesize"
            layout="total, prev, pager, next,sizes, jumper"
            background
            :total="totalCount">
            </el-pagination>
        </div>        
    </el-card>
</template> 
<script>
import SelectTree from "./SelectTree";
//展开数组嵌套
// var nlist = []
// function getChildren(arr){
//     for(let item of arr){
//         if(!nlist.includes(item)){
//             nlist.push(item)
//         }
//         if(item.childrenList.length>0){
//             getChildren(item.childrenList)
//         }else{return}
//     }
// }
export default {
    data(){
        return {
            searchForm:{
                "pageNum": 1,
                "pageSize": 10,
            },
            pageInfo:{},
            currentPage: 1,
            pagesize:10,
            pageNum:1,
            pageSize:10,
            totalCount:0,
            totalPage:0,
            tableHeight:50,
            tabelList:[],
            userList:[],
            organList:[],
            allOrganList:[],
            userRoleList:[],
            selectUser:{},
            selectRole:{},
            valueId: 0,//树型选择初始ID
            //编辑用户开始
            editOrganId:0,
            editRoleName:'',
            editUserForm:{},
            editSelectRole:{},
            selectEditOrgan:undefined,
            addUserForm:{

            },
            addUserVisible:false,
            editUserVisible:false,
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },
            rules: {
                userName:[
                    { required: true, message: '请输入登录名称', trigger: ['blur', 'change'] },
                     {pattern:/^[0-9a-zA-Z]+$/,message:'请使用英文或数字',trigger: ['blur', 'change']}
                ],
                nickName:[
                    { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] }
                   
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                phone: [
                    { required: true, trigger: ['blur', 'change'],message: '请输入手机号码'  },
                    {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号',
                    trigger: ['blur', 'change']}
                ]
            }            
        }
    },
     computed: {
    /* 转树形数据 */
        // optionData() {
        // let cloneData = JSON.parse(localStorage.organList); // 对源数据深度克隆
        // return cloneData.filter(father => {
        //     // 循环所有项，并添加children属性
        //     let branchArr = cloneData.filter(child => father.id == child.parentId); // 返回每一项的子级数组
        //     branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
        //     return father.parentId == 0; //返回第一层
        // });
        // }
    },
    components:
       { SelectTree,}
    ,
    created(){
        // this.utils.getUserList(this,this.searchForm)
        this.utils.getOrganList(this)
        this.getList(this.searchForm)
    },
    mounted(){
        this.tableChange()
    },
    methods:{
        userSelect(e){
            this.selectUser = e
        },
        CheckChange(){

        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('user/userList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('user/userList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },        
        getList(form){
            this.$http.post('user/userList',form
            ).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.pagesize = this.pageInfo.pageSize
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
        },        
        searchUser(){
            this.searchForm.pageNum = 1
            this.$http.post('/user/userList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'查询成功'
                    })
                    //this.$refs.selectTree.clearHandle()  
                }
                 
            })
        },
        clear(){
            this.searchForm={
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            }
            this.getList(this.searchForm)
        },
        openAdd(){
            this.allOrganList = this.utils.getAllNode(this.organList,'childrenList')
            this.addUserVisible=true
            this.addUserForm={}
            // this.clearValidate('addUserForm')
        },
        addUser(){
            // if(this.addUserForm.organId){
            //     this.addUserForm.organName = this.organList[this.organList.findIndex((item)=>{return item.id===this.addUserForm.organId})].organName
            // }
            // if(this.addUserForm.roleId){
            //     this.addUserForm.roleName = this.userRoleList[this.userRoleList.findIndex((item)=>{return item.id===this.addUserForm.roleId})].roleName
            // }
            // console.log(this.addUserForm.roleName)
            this.utils.addUser(this,this.addUserForm)
            this.addUserVisible = false
            this.getList(this.searchForm)
        },
        cancelAdd(){
            this.addUserVisible=false
            this.$refs.addTree.clearHandle()
            this.addUserForm= {}
            this.clearValidate('addUserForm')
        },
        delUser(){
            let that = this
            this.selectUser.forEach((item)=>{     
                if(item.id!==0){
                    let id = item.id
                    // console.log(id)
                    this.utils.delUser(id).then((res)=>{
                        if(res.data.code===200){
                            this.$message({
                                type:'success',
                                message:'删除成功'
                            })
                        this.getList({
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            })
                        }
                    })
                }
            })    
        },
        //操作栏的删除
        delUserC(v){
            let id = v.id
            this.$http.delete(`/user/delete/${id}`).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                        this.getList({
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            })
                    }
            })
        },
        openEdit(row){
            this.editUserVisible = true
            this.editUserForm = Object.assign({},row)
            this.$http.post(`role/list/${row.organId}`).then(res=>{
                    this.userRoleList = res.data.data
                }) 
            // console.log(row)
        },
        editUser(){
            let that = this
            // if(this.editUserForm.roleName){
            //     this.editUserForm.roleId = this.userRoleList.filter(item=>item.roleName===this.editUserForm.roleName)[0].roleId
            // }            
            this.utils.editUser(this.editUserForm).then((res)=>{
                this.getList(this.searchForm) 
                       if(res.data.code===200){
                            this.$message({
                                type:'success',
                                message:'编辑成功'
                            }) 
                       }
                this.editUserVisible= false
                this.$refs.editTree.clearHandle()  
            })
            
        },
        changeOrgan(e){
            let that = this,id = e
            this.userRoleList = []
            this.editUserForm.roleId = '请选择'
            this.$http.post(`role/list/${id}`).then(res=>{
                this.userRoleList = res.data.data
            })

        },
        changeRole(e){
            this.addUserForm.roleId = e
            this.addUserForm.roleName = this.userRoleList.filter(item=>item.id===e)[0].roleName
           
        },
        changeEditRole(e){
            this.editUserForm.roleName = e
            this.editUserForm.roleId = this.userList.filter(item=>item.roleName===e)[0].roleId
          
        },
        //格式化
        phoneFormat(row){
            let p = row.phone
            return p.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
        },
        formatTime(row){
            let val = row.createTime
            let date = new Date(val) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
            let D = date.getDate() + ' '
            let h = date.getHours() + ':'
            let m = date.getMinutes() + ':'
            let s = date.getSeconds()
            return Y+M+D+h+m+s            
        },
        // 取值
        getValue(value) {
            this.valueId = value;
            this.addUserForm.organId = value
            this.userRoleList = []
            this.selectRole = undefined
            if(value){
                this.$http.post(`role/list/${value}`).then(res=>{
                    this.userRoleList = res.data.data
                })
                this.addUserForm.organName = this.allOrganList.filter(item=>item.id===value)[0].organName
            }
        },  
        getEditValue(value){
            this.editOrganId = value
            this.editUserForm.organId = value
            if(this.editUserForm.organId){
                this.editUserForm.organName = this.allOrganList.filter(item=>item.id===this.editUserForm.organId)[0].organName
            }
            this.userRoleList = []
            this.selectRoleName = null
            this.editUserForm.roleId = null
            this.editUserForm.roleName = null
            if(value){
                 this.$http.post(`role/list/${value}`).then(res=>{
                    this.userRoleList = res.data.data
                }) 
            }
                      
        },
        clearValidate(formName) {
        this.$refs[formName].clearValidate();
        },           
        tableChange(){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 235;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 235
            }
        })
        //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
　　　　 //240表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度　
        },           
    }
}
</script>
<style scoped>
    .el-table{
        margin-top: 20px;
    }
    .el-dialog__body .el-input{
        width: 120px;
    }
    .el-dialog__body .el-select{
        width: 120px;
    }    
    /* card样式 */
    .box-card /deep/ .el-card__header{
        height: 4vh;
        background: #19437e;
        color: #fff;
        display: flex;
        align-items: center;
        border: none;
    }
    .box-card {
        width: 82vw;
        height: 78vh;
        background: rgba(11,53,115,0.2);
        border: none;
        border-radius: 5px;
        margin: 0 auto;
        position: relative;
    } 
    .page{
        position: absolute;
        bottom: 20px;
    }
     /* form样式 */

     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input,.el-select{
         width:150px;
     }
    .el-form /deep/ .el-form-item__label{
        color: #fff ;
    }
    .el-input /deep/ .el-input__inner{
        background: none;
        height: 30px;
        color: #fff;
    }
    .el-select /deep/ .el-input__inner {
        background-color: transparent;
        height: 30px;
    } 
    .el-form /deep/ .el-input__inner{
      color: #fff
    } 
    .choose-btn{
        width:150px;
    } 
               /* dialog样式 */
    .box-card /deep/ .el-dialog__header{
        background: #19437e;
        padding:10px;
    }
    .box-card /deep/ .el-dialog__title{
        color: #fff;
    }
     .box-card /deep/ .el-dialog__body{
         background: #143666;
         color: #fff;
     }
     .box-card /deep/ .el-dialog__footer{
         background: #143666;
     }  
</style>