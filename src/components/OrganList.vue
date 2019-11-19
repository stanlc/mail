<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>机构管理</span>
            </div>
            <div>
                <el-form :inline="true">
                    <el-form-item>
                        <!-- 超级管理员才显示录入同级 -->
                        <el-button type="primary" v-if="userLevel===1 && selectParentId === null ?true:false" @click="sameDialogVisible=true" >录入同级</el-button>       
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openAddSub">录入下级</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openConfig">编辑</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="delOrgan">删除</el-button>
                    </el-form-item>
                </el-form>
            <el-tree :data="organList" :props="organProps" @node-click="handleNodeClick"></el-tree>
            <!-- 录入同级Dialog -->
            <el-dialog
            title="录入同级"
            :visible.sync="sameDialogVisible"
            width="35%"
            custom-class="sameLevel">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="sameinnerVisible"
            append-to-body>
            </el-dialog>
            <span class="blue">添加同级组织机构</span>
            <el-form label-position="right" :inline="true" label-width="auto" :model="sameLevelForm" ref="sameLevelForm">
                <el-form-item label="机构名称:" prop="name">
                    <el-input v-model="sameLevelForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="机构描述:">
                    <el-input v-model="sameLevelForm.organDesc"></el-input>
                </el-form-item>
                <el-form-item label="负责人:">
                    <el-input v-model="sameLevelForm.organPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="sameLevelForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="机构精度:">
                    <el-input v-model="sameLevelForm.organLatitude"></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:">
                    <el-input v-model="sameLevelForm.organLongitude"></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="sameinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSameOrgan">确认</el-button>
                <el-button @click="sameDialogVisible =false">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 录入同级Dialog -->
            <!-- 录入下级Dialog -->
            <el-dialog
            title="录入下级"
            :visible.sync="subDialogVisible"
            width="35%"
            custom-class="subLevel">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="subinnerVisible"
            append-to-body>
            </el-dialog>
            <span class="blue">添加下级组织机构</span>
            <el-form label-position="right" :inline="true" label-width="auto" :model="subLevelForm">
                <el-form-item label="机构名称:" >
                    <el-input v-model="subLevelForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="机构描述:">
                    <el-input v-model="subLevelForm.organDesc"></el-input>
                </el-form-item>
                <el-form-item label="负责人:">
                    <el-input v-model="subLevelForm.organPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="subLevelForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="机构精度:">
                    <el-input v-model="subLevelForm.organLatitude"></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:">
                    <el-input v-model="subLevelForm.organLongitude"></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="subinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSubOrgan">确认</el-button>
                <el-button @click="subDialogVisible =false">取消</el-button>
            </span>
            </el-dialog>
            <!-- 录入下级Dialog -->
            <!-- 编辑Dialog -->
            <el-dialog
            title="编辑"
            :visible.sync="configDialogVisible"
            width="35%"
            custom-class="configLevel">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="configinnerVisible"
            append-to-body>
            </el-dialog>
            <span class="blue">编辑组织机构</span>
            <el-form label-position="right" :inline="true" label-width="auto" :model="configForm" @submit.prevent="ConfigOrgan" >
                <el-form-item label="机构名称:" >
                    <el-input v-model="configForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="机构描述:">
                    <el-input v-model="configForm.organDesc"></el-input>
                </el-form-item>
                <el-form-item label="负责人:">
                    <el-input v-model="configForm.organPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="configForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="机构精度:">
                    <el-input v-model="configForm.organLatitude"></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:">
                    <el-input v-model="configForm.organLongitude"></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="configinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="configDialogVisible=false" native-type="submit">确认</el-button>
                <el-button @click="configDialogVisible =false">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 编辑Dialog -->
            </div>
        </el-card>
        <el-card class="box-card right">
            <div slot="header" class="clearfix">
                <span>角色管理</span>
            </div>
            <div>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="addRoleDialogVisible=true">录入</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="configRole" :disabled="roleSelects.length!==1">编辑</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="delRole" :disabled="roleSelects.length===0">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openRoleMenuConfig" :disabled="roleSelects.length!==1">权限配置</el-button>
                    </el-form-item>
                </el-form>
                    <el-table
                    :data="roleList"
                    style="width: 100%"
                    @select="roleSelect"
                    @check-change="RoleCheckChange"
                    >
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        label="序号"
                        type="index">
                        </el-table-column>
                        <el-table-column
                        label="用户名称"
                        prop="roleName"
                        >
                        </el-table-column>
                        <el-table-column
                        label="角色描述"
                        prop="roleDesc"
                        >
                        </el-table-column>
                        <el-table-column
                        label="创建时间"
                        prop="createTime"
                        :formatter="formatTime"
                        >
                        </el-table-column>
                    </el-table>
            <!-- 添加角色Dialog -->
            <el-dialog
            title="角色录入"
            :visible.sync="addRoleDialogVisible"
            width="35%"
            custom-class="sameLevel">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="addRoleinnerVisible"
            append-to-body>
            </el-dialog>
            <el-form label-position="right"  label-width="auto" :model="addRoleForm">
                <el-form-item label="角色名称:">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述:">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">确认</el-button>
                <el-button @click="addRoleDialogVisible =false">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 添加角色Dialog --> 
            <!-- 编辑角色Dialog -->
            <el-dialog
            title="角色编辑"
            :visible.sync="configRoleDialogVisible"
            width="35%"
            custom-class="sameLevel">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="configRoleinnerVisible"
            append-to-body>
            </el-dialog>
            <el-form label-position="right"  label-width="auto" :model="configRoleForm">
                <el-form-item label="角色名称:">
                    <el-input v-model="configRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述:">
                    <el-input v-model="configRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="configRole">确认</el-button>
                <el-button @click="configRoleDialogVisible =false">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 编辑角色Dialog -->    
            <!-- 权限配置Dialog -->
            <el-dialog
            title="权限编辑"
            :visible.sync="MenuConfigRoleDialogVisible"
            width="35%"
            custom-class="sameLevel">
            <span class="blue">菜单权限</span>
            <el-tree
            :data="menuConfigList"
            :props="menuConfigProps"
            @check-change="menuTreeCheck"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :default-checked-keys="isAuthed">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="MenuConfigRole">提交</el-button>
                <el-button @click="MenuConfigRoleDialogVisible =false">取消</el-button>
            </span>
            </el-dialog>
            <!-- 权限配置Dialog -->                                 
            </div>
        </el-card>        
    </div>
    
    
</template>
<script>
export default {
    data(){
        return{
            organList:[],
            roleList:[],
            selectConfigMenu:[],//权限配置的已选择权限项
            isAuthed:[],//角色已经配置的权限
            selectOrganId:0,
            selectRoleId:0,
            selectRole:[],
            menuConfigList:[],
            selectParentId:null,
            userLevel:JSON.parse(localStorage.userInfo).level,
            sameDialogVisible: false,
            sameinnerVisible:false,
            subDialogVisible:false,
            subinnerVisible:false,
            configDialogVisible:false,
            configinnerVisible:false,
            addRoleDialogVisible:false,
            addRoleinnerVisible:false,
            configRoleDialogVisible:false,
            configRoleinnerVisible:false,
            MenuConfigRoleDialogVisible:false,
            roleSelects:[],
            sameLevelForm:{
                "organDesc": "",
                "organLatitude": "",
                "organLongitude": "",
                "organName": "",
                "organPerson": "",
                "phone": "",
            },
            subLevelForm:{
                "action":2,
                "referId":0,
                "organDesc": "",
                "organLatitude": "",
                "organLongitude": "",
                "organName": "",
                "organPerson": "",
                "phone": "",
            },
            configForm:{
                "organDesc": "",
                "organLatitude": "",
                "organLongitude": "",
                "organName": "",
                "organPerson": "",
                "phone": "",               
            },
            addRoleForm:{
                "roleName":'',
                "roleDesc":'',
                "organId":0,
            },
            configRoleForm:{
                "roleName":'',
                "roleDesc":'',
                "organId":0,               
            },
            organProps:{ 
                children: 'childrenList',
                label: 'organName',
                id:'id'
            },
            menuConfigProps:{
                children: 'childrenList',
                label: 'resourceName',
                id:'id'
            }
        }
    },
    created(){
        this.utils.getOrganList(this)
        this.menuConfigList = JSON.parse(localStorage.menuList)
    },
    methods:{
        handleNodeClick(e){
            this.selectOrganId = e.id
            this.selectParentId = e.parentId
            this.configForm = e
            this.utils.getRoleList(this,e.id)
        },
        addSameOrgan(){
            this.$http.post('/organ/add',this.sameLevelForm).then(res=>{
                if(res.data.code===200){
                    this.$message('添加成功')
                    this.utils.getOrganList(this)
                }else{
                    this.$message('添加失败') 
                }
                this.sameDialogVisible = false
            })
        },
        openAddSub(){
            if(this.selectOrganId===0){
                this.$message({
                    type:'error',
                    message:'请先选择组织'
                })
            }else{
                this.subDialogVisible=true
                this.subLevelForm.referId = this.selectOrganId
                
            }
        },
        openConfig(){
            if(this.selectOrganId===0){
                this.$message({
                    type:'error',
                    message:'请先选择组织'
                })
            }else{
                this.configDialogVisible=true
            }            
        },
        delOrgan(){
            if(this.selectOrganId===0){
                this.$message({
                    type:'error',
                    message:'请先选择组织'
                })
            }else{
                this.$http.delete(`/organ/delete/${this.selectOrganId}`).then(res=>{
                    if(res.data.code===200){
                        this.$message('删除成功')
                        this.utils.getOrganList(this)
                    }else{
                        this.$message({
                            type:'error',
                            message:'删除失败，请重试'
                        })
                    }
                })
            }             
        },
        addSubOrgan(){
             this.$http.post('/organ/add',this.subLevelForm).then(res=>{
                if(res.data.code===200){
                    this.$message('添加成功')
                    this.utils.getOrganList(this)
                }else{
                    this.$message('添加失败') 
                }
                this.subDialogVisible = false
            })
        },
        addRole(){
            if(this.selectOrganId===0){
                this.$message({
                    type:'error',
                    message:'请先选择组织'
                })
            }else{
                let that = this
                this.addRoleForm.organId = this.selectOrganId
                this.utils.addRole(this.addRoleForm).then(()=>{
                    that.utils.getRoleList(that,that.selectOrganId) 
                })
            }
            this.addRoleDialogVisible = false
        },
        roleSelect(e){
            this.selectRole = e
            if(e.length===1){
                this.configRoleForm = e[0]
                this.selectRoleId = e[0].id
                this.$http.get(`/resource/list/${this.selectRoleId}`).then(res=>{
                    let list = res.data.data
                    let idlist = []
                    list.forEach(item => {
                        if(item.isAuth===1){
                            idlist.push(item.id)
                        }
                        if(item.childrenList.length>0){
                            item.childrenList.map(item=>{
                                if(item.isAuth===1){
                                    idlist.push(item.id)
                                }
                            })
                        }
                        return idlist
                    });
                    this.isAuthed = idlist
                })
            }
            this.roleSelects = e
         },
         RoleCheckChange(){
             this.isAuthed = []
         },
        configRole(){
                this.configRoleDialogVisible = true
        },
        delRole(){
            let that = this
            this.selectRole.forEach((item)=>{
                if(item.id!==0){
                    let id = item.id
                    this.utils.delRole(id).then(()=>{
                       that.utils.getRoleList(that,that.selectOrganId) 
                    })
                }
            })
               
            this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                
            
        },
        //权限配置
        openRoleMenuConfig(){
                this.MenuConfigRoleDialogVisible = true
        },
        menuTreeCheck(){
            let list = this.$refs.tree.getCheckedKeys()
            this.selectConfigMenu = list
        },
        MenuConfigRole(){
            if(this.selectConfigMenu.length===0){
                this.$message({
                    type:'error',
                    message:'请选择至少一项权限'
                })
            }else{
                this.$http.post(`/resource/auth/${this.selectRoleId}/?resourceIds=${this.selectConfigMenu.toString()}`).then(res=>{
                    if(res.data.code===200){
                        this.MenuConfigRoleDialogVisible = false
                    }
                })
            }
        },
        //内容格式化
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
        }
    }
}
</script>
<style scoped>
    .box-card {
        width: 40vw;
        height: 54vh;
        background: #06253d;
        border-radius: 5px;
        float: left;
    }
    .right{
       float: right;
    }
    .blue{
        color:#10bdd6;
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
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input{
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
    .choose-btn{
        width:150px;
    }
    /*el-tree样式*/
    .el-tree{
        background: none;
    }
    /* .el-tree:hover{
        background: none;
    } */
    .el-tree-node__content:hover{
        background: none;
    }
</style>