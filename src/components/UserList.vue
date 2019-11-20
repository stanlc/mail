<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>用户管理</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="用户名称：">
                    <el-input v-model="searchForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="登录名称：">
                    <el-input v-model="searchForm.userName"></el-input>
                </el-form-item> 
                <el-form-item label="手机号：">
                    <el-input v-model="searchForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：">
                    <el-input v-model="searchForm.email"></el-input>
                </el-form-item>               
                <el-form-item>
                    <el-button type="primary" @click="searchUser">查询</el-button>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form>
                <el-button type="primary" @click="addUserVisible=true">新增用户</el-button>
                <el-button type="danger" @click="delUser">删除</el-button>
            </el-form>
            <el-table
            :data="userList"
            style="width: 100%"
            @select="userSelect"
            @check-change="CheckChange"
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
                fixed="right"
                width="200"
                >
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="delUser">删除</el-button>
                    </template>                
                </el-table-column>                                
            </el-table>
            <!-- 编辑用户Dialog -->
            <el-dialog
            title="编辑用户"
            :visible.sync="editUserVisible"
            width="35%"
            >
            <el-form label-position="right"  label-width="auto" :model="editUserForm" :inline="true">
                    <el-form-item label="机构名称：" >
                        <select-tree
                        :props="props"
                        :options="organList"
                        :value="editOrganId"
                        @getValue="getEditValue($event)"
                        v-model="selectEditOrgan"
                        ></select-tree>
                    </el-form-item>
                    <el-form-item label="所属角色：">
                        <el-select v-model="editSelectRole"> 
                            <el-option v-for="item in userRoleList" :key="item.index" :label="item.roleName" :value="item.id"></el-option>
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
                    <el-form-item>
                            <el-button type="primary" @click="editUser()">提交</el-button>
                    </el-form-item><el-form-item>
                        <el-button type="primary" @click="editUserVisible=false">取消</el-button>
                    </el-form-item>
            </el-form>
            </el-dialog>
            <!-- 编辑用户Dialog --> 
            <!-- 添加用户Dialog -->
            <el-dialog
            title="新增用户"
            :visible.sync="addUserVisible"
            width="35%"
            >           
            <el-form label-position="right"  label-width="auto" :model="addUserForm" :inline="true">
                <el-form-item label="机构名称：" >
                    <select-tree
                    :props="props"
                    :options="organList"
                    :value="valueId"
                    @getValue="getValue($event)"
                    v-model="selectOrgan"
                    ></select-tree>
                </el-form-item>
                <el-form-item label="所属角色：">
                    <el-select v-model="selectRole" @change="changeRole"> 
                        <el-option v-for="item in userRoleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>     
                    <el-form-item label="用户名称：">
                        <el-input v-model="addUserForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="登录名称：">
                        <el-input v-model="addUserForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮件：">
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：">
                        <el-input v-model="addUserForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addUser">添加</el-button>
                    </el-form-item><el-form-item>
                        <el-button type="primary" @click="addUserVisible=false">取消</el-button>
                    </el-form-item>
            </el-form>
            </el-dialog>
            <!-- 添加用户Dialog -->                          
        </div>
    </el-card>
</template>
<script>
import SelectTree from "./SelectTree";
export default {
    data(){
        return {
            searchForm:{
                pageNum:1,
                pageSize:10,
                "pageNum": this.pageNum,
                "pageSize": this.pageSize,
            },
            userList:[],
            organList:[],
            userRoleList:[],
            selectUser:{},
            selectOrgan:undefined,
            selectRole:undefined,
            valueId: 0,//树型选择初始ID
            editOrganId:0,
            editSelectRole:{},
            selectEditOrgan:undefined,
            addUserForm:{

            },
            editUserForm:{},
            addUserVisible:false,
            editUserVisible:false,
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },
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
        this.utils.getUserList(this,this.searchForm)
        this.organList = JSON.parse(localStorage.organList)
    },
    methods:{
        userSelect(e){
            this.selectUser = e
            // console.log(e)
        },
        CheckChange(){

        },
        searchUser(){
            this.utils.getUserList(this,this.searchForm)
        },
        clear(){
            this.searchForm = {"pageNum": this.pageNum,"pageSize": this.pageNum,}
            this.utils.getUserList(this,{"pageNum": this.pageNum,
                "pageSize": this.pageNum,})
        },
        addUser(){
            if(this.addUserForm.organId){
                this.addUserForm.organName = this.organList[this.organList.findIndex((item)=>{return item.id===this.addUserForm.organId})].organName
            }
            if(this.addUserForm.roleId){
                this.addUserForm.roleName = this.userRoleList[this.userRoleList.findIndex((item)=>{return item.id===this.addUserForm.roleId})].roleName
            }
            // console.log(this.addUserForm.roleName)
            this.utils.addUser(this,this.addUserForm)
            this.addUserVisible = false
            this.utils.getUserList(this,this.searchForm)
        },
        delUser(){
            let that = this
            this.selectUser.forEach((item)=>{     
                if(item.id!==0){
                    let id = item.id
                    // console.log(id)
                    this.utils.delUser(id).then(()=>{
                        that.utils.getUserList(that,that.searchForm)
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    })
                }
            })    
        },
        openEdit(row){
            this.editUserVisible=true
            this.editUserForm = row
        },
        editUser(){
            let that = this
            if(this.editUserForm.organId){
                this.editUserForm.organName = this.organList[this.organList.findIndex((item)=>{return item.id===this.editUserForm.organId})].organName
            }
            if(this.editUserForm.roleId){
                this.editUserForm.roleName = this.userRoleList[this.userRoleList.findIndex((item)=>{return item.id===this.editUserForm.roleId})].roleName
            }            
            this.utils.editUser(this.editUserForm).then(()=>{
                that.utils.getUserList(that,that.searchForm)
                        this.$message({
                            type:'success',
                            message:'编辑成功'
                        }) 
                this.editUserVisible= false                       
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
        this.$http.post(`role/list/${value}`).then(res=>{
                this.userRoleList = res.data.data
            })
        },  
        getEditValue(value){
            this.editOrganId = value
            this.editUserForm.organId = value
            this.userRoleList = []
            this.editSelectRole = undefined
            this.$http.post(`role/list/${value}`).then(res=>{
                    this.userRoleList = res.data.data
                })            
        }           
        
    }
}
</script>
<style scoped>
    .el-table{
        margin-top: 20px;
    }
    .el-dialog__body .el-input{
        width: 130px;
    }
    .el-dialog__body .el-select{
        width: 130px;
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
        background: #06253d;
        border-radius: 5px;
        margin: 0 auto;
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
     }
     .box-card /deep/ .el-dialog__footer{
         background: #143666;
     }
     .sameLevel{
         border-radius: 5px;
     }          
</style>