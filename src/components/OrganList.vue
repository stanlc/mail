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
                        <el-button type="primary" @click="openAddSub" :disabled="addSubBtn">录入下级</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openConfig" :disabled="editOrgBtn">编辑</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="delOrgan" :disabled="delOrgBtn">删除</el-button>
                    </el-form-item>
                </el-form>
            <div  class="organTree">
                <el-tree :data="organList" :props="organProps" @node-click="handleNodeClick" default-expand-all></el-tree>
            </div>
            <!-- 录入同级Dialog -->
            <el-dialog
            title="录入同级"
            :visible.sync="sameDialogVisible"
            width="40%"
            custom-class="sameLevel"
            @close="clearValidate('sameLevelForm')">
            <el-dialog
            width="40%"
            title="请选择经纬度"
            :visible.sync="sameinnerVisible"
            append-to-body>
            <vue-amap @func="getLng" @closefunc="closeMap"></vue-amap>
            </el-dialog>
            <span class="blue">添加同级组织机构</span>
            <el-form label-position="right" :inline="true" label-width="90px" :model="sameLevelForm" ref="sameLevelForm" :rules="rules">
                <el-form-item label="机构名称:" prop="organName">
                    <el-input v-model="sameLevelForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="机构描述:" prop="organDesc">
                    <el-input v-model="sameLevelForm.organDesc"></el-input>
                </el-form-item>
                <el-form-item label="负责人:" prop="organPerson">
                    <el-input v-model="sameLevelForm.organPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="sameLevelForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="机构经度:" >
                    <el-input v-model="sameLevelForm.organLatitude" disabled></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:" >
                    <el-input v-model="sameLevelForm.organLongitude" disabled></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="sameinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSameOrgan">确认</el-button>
                <el-button @click="sameDialogVisible =false;clearValidate('sameLevelForm')" type="primary">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 录入同级Dialog -->
            <!-- 录入下级Dialog -->
            <el-dialog
            title="录入下级"
            :visible.sync="subDialogVisible"
            width="40%"
            custom-class="subLevel"
            @close="clearValidate('subLevelForm')">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="subinnerVisible"
            append-to-body>
            <vue-amap @func="getSubLng" @closefunc="closeMap"></vue-amap>
            </el-dialog>
            <span class="blue">添加下级组织机构</span>
            <el-form label-position="right" :inline="true" label-width="90px" :model="subLevelForm" :rules="rules" ref="subLevelForm">
                <el-form-item label="机构名称:" prop="organName">
                    <el-input v-model="subLevelForm.organName"></el-input>
                </el-form-item>
                <el-form-item label="机构描述:" prop="organDesc">
                    <el-input v-model="subLevelForm.organDesc"></el-input>
                </el-form-item>
                <el-form-item label="负责人:" prop="organPerson">
                    <el-input v-model="subLevelForm.organPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="subLevelForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="机构经度:">
                    <el-input v-model="subLevelForm.organLatitude" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:">
                    <el-input v-model="subLevelForm.organLongitude" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="subinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSubOrgan">确认</el-button>
                <el-button @click="subDialogVisible =false;clearValidate('subLevelForm')">取消</el-button>
            </span>
            </el-dialog>
            <!-- 录入下级Dialog -->
            <!-- 编辑组织Dialog -->
            <el-dialog
            title="编辑"
            :visible.sync="configDialogVisible"
            width="40%"
            custom-class="configLevel"
            @close="clearValidate('configForm')">
            <el-dialog
            width="30%"
            title="请选择经纬度"
            :visible.sync="configinnerVisible"
            append-to-body>
            <vue-amap @func="getCofLng" @closefunc="closeMap"></vue-amap>
            </el-dialog>
            <span class="blue">编辑组织机构</span>
            <el-form label-position="right" :inline="true" label-width="90px" :model="configForm" ref="configForm">
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
                <el-form-item label="机构经度:">
                    <el-input v-model="configForm.organLongitude" disabled></el-input>
                </el-form-item>
                <el-form-item label="机构纬度:">
                    <el-input v-model="configForm.organLatitude" disabled></el-input>
                </el-form-item>
                <el-form-item label="地图定点:">
                    <el-button type="success" icon="el-icon-map-location" @click="configinnerVisible=true" class="choose-btn">选择经纬度</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editOrgan">确认</el-button>
                <el-button @click="configDialogVisible =false;clearValidate('configForm')">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 编辑组织Dialog -->
            </div>
        </el-card>
        <el-card class="box-card right">
            <div slot="header" class="clearfix">
                <span>角色管理</span>
            </div>
            <div>
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" @click="addRoleDialogVisible=true" :disabled="addUserBtn">录入</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="configRole" :disabled="editUserBtn">编辑</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="delRole" :disabled="delUserBtn">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openRoleMenuConfig" :disabled="configUserBtn">权限配置</el-button>
                    </el-form-item>
                </el-form>
                    <el-table
                    :data="roleList"
                    style="width: 100%"
                    @select="roleSelect"
                    @check-change="RoleCheckChange"
                    height="250"
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
                        width="200"
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
            <el-form label-position="right"  label-width="90px" :model="addRoleForm" :rules="rules">
                <el-form-item label="角色名称:" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述:" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">确认</el-button>
                <el-button @click="addRoleDialogVisible =false" type="primary">取 消</el-button>
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
            <el-form label-position="right"  label-width="90px" :model="configRoleForm">
                <el-form-item label="角色名称:">
                    <el-input v-model="configRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述:">
                    <el-input v-model="configRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editRole">确认</el-button>
                <el-button @click="configRoleDialogVisible =false">取 消</el-button>
            </span>
            </el-dialog>
            <!-- 编辑角色Dialog -->    
            <!-- 权限配置Dialog -->
            <el-dialog
            title="权限编辑"
            :visible.sync="MenuConfigRoleDialogVisible"
            width="35%"
            custom-class="sameLevel"
            @close="Autheds = [];$refs.tree.setCheckedKeys(Autheds)">
            <span class="blue">菜单权限</span>
            <div class="organTree">
                <el-tree
                :data="menuConfigList"
                :props="menuConfigProps"
                @check-change="menuTreeCheck"
                show-checkbox
                node-key="id"
                ref="tree"
                default-expand-all
                >
                </el-tree> 
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="MenuConfigRole">提交</el-button>
                <el-button @click="MenuConfigRoleDialogVisible =false;Autheds = [];$refs.tree.setCheckedKeys(Autheds)">取消</el-button>
            </span>
            </el-dialog>
            <!-- 权限配置Dialog -->                                 
            </div>
        </el-card>        
    </div>
    
    
</template>
<script>
import VueAmap from '../components/VueAmap'
export default {
    components:{
        VueAmap,
    },
    data(){
        return{
            organList:[],
            roleList:[],
            selectConfigMenu:[],//权限配置的已选择权限项
            isAuthed:[],//角色已经配置的权限
            Autheds:[],
            selectOrganId:0,
            selectRoleId:0,
            selectRole:[],
            menuConfigList:[],
            selectParentId:null,
            userLevel:JSON.parse(localStorage.userInfo).level,
            userOrganId:JSON.parse(localStorage.userInfo).organId,
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
            },
           rules: {
                organName:[
                    { required: true, message: '请输入机构名称', trigger: ['blur', 'change'] }
                ],
                organDesc:[
                    { required: true, message: '请输入机构描述', trigger: ['blur', 'change'] }
                ],
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
                ],
                roleDesc:[
                    { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
                ],                
                organPerson:[
                    { required: true, message: '请输入负责人', trigger: 'blur' },
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
    computed:{
        //机构管理按钮
        addSubBtn(){
            if(this.userLevel===1){
                return false
            }else{
                return this.selectOrganId!==this.userOrganId || this.selectOrganId===0 
            }
            
        },
        editOrgBtn(){
            if(this.userLevel===1){
                return false
            }else{
                return this.selectOrganId===this.userOrganId ||this.selectOrganId===0 || this.selectParentId!==this.userOrganId
            }
        },
        delOrgBtn(){
            if(this.userLevel===1){
                return false
            }else{
                return this.selectOrganId===this.userOrganId ||this.selectOrganId===0 || this.selectParentId!==this.userOrganId
            }
        },
        //角色管理按钮     
        addUserBtn(){
            if(this.userLevel===1){
                return false
            }else{
                return this.selectOrganId===this.userOrganId || this.selectParentId!==this.userOrganId
            }
        },
        editUserBtn(){
            if(this.userLevel===1){
                return this.selectRole.length===0||this.selectRole.length>1
            }else{
                return this.selectOrganId===this.userOrganId||this.selectRole.length===0||this.selectRole.length>1 || this.selectParentId!==this.userOrganId
            }
            
        },
        delUserBtn(){
            if(this.userLevel===1){
                return this.selectRole.length===0
            }else{
                return this.selectOrganId===this.userOrganId||this.selectRole.length===0 || this.selectParentId!==this.userOrganId
            }
        },
        configUserBtn(){
            if(this.userLevel===1){
                return this.selectRole.length===0||this.selectRole.length>1
            }else{
                return this.selectOrganId===this.userOrganId||this.selectRole.length===0||this.selectRole.length>1 || this.selectParentId!==this.userOrganId
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
            this.configForm = Object.assign({},e)
            this.utils.getRoleList(this,e.id)
        },
        addSameOrgan(){
            this.$http.post('/organ/add',this.sameLevelForm).then(res=>{
                if(res.data.code===200){
                    this.$message({type:'success',message:'添加成功'})
                    this.utils.getOrganList(this)
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
        editOrgan(){
            this.configDialogVisible=false
            this.$http.post('/organ/edit',this.configForm).then(res=>{
                if(res.data.code===200){
                    this.$message({type:'success',message:'编辑组织成功'})
                }
            })
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
                        this.$message({type:'success',message:'删除成功'})
                        this.utils.getOrganList(this)
                    }
                })
            }             
        },
        addSubOrgan(){
             this.$http.post('/organ/add',this.subLevelForm).then(res=>{
                if(res.data.code===200){
                    this.$message({type:'success',message:'添加成功'})
                    this.utils.getOrganList(this)
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
                this.utils.addRole(this.addRoleForm).then((res)=>{
                    if(res.data.code===200){
                        this.$message({type:'success',message:'添加成功'})
                        that.utils.getRoleList(that,that.selectOrganId)  
                    }
                   
                })
            }
            this.addRoleDialogVisible = false
        },
        roleSelect(e){
            this.selectRole = e
            if(e.length>0){
                let id = e[0].id 
                this.selectRoleId = id 
            }
            this.configRoleForm = Object.assign({},e[0])
            let list = []

            
         },
         RoleCheckChange(){
            
         },
        configRole(){
            this.configRoleDialogVisible = true
        },
        editRole(){
            let that = this 
            this.utils.editRole(that.configRoleForm).then((res)=>{
                that.utils.getRoleList(that,that.selectOrganId)
                if(res.data.code===200){
                    this.$message({
                            type:'success',
                            message:'编辑角色成功'
                        })
                }
                that.configRoleDialogVisible = false        
            })             
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
                this.Autheds = []
                this.MenuConfigRoleDialogVisible = true
                let id = this.selectRoleId
                this.$http.get(`/resource/list/${id}`).then(res=>{
                    let list = res.data.data
                    let nlist = this.utils.getAllNode(list,'childrenList')
                    this.isAuthed = nlist.filter(item=>item.isAuth===1)
                    for(let item of this.isAuthed){
                        this.Autheds.push(item.id)
                        this.$refs.tree.setCheckedKeys(this.Autheds)
                    } 
                })
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
                        this.$message({
                            type:'success',
                            message:'权限配置成功'
                        })
                        this.MenuConfigRoleDialogVisible = false
                    }
                })
                this.$refs.tree.setCheckedKeys([])
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
        },
        //获取经纬度
        getLng(data){
            this.sameLevelForm.organLatitude = data[0]
            this.sameLevelForm.organLongitude = data[1]
        },
        getSubLng(data){
            this.subLevelForm.organLatitude = data[0]
            this.subLevelForm.organLongitude = data[1]
        },
        getCofLng(data){
            this.configForm.organLatitude = data[0]
            this.configForm.organLongitude = data[1]
        },
        //关闭地图
        closeMap(data){
            this.sameinnerVisible = data
            this.subinnerVisible  = data
            this.configinnerVisible = data
        },
        clearValidate(formName) {
        this.$refs[formName].clearValidate();
        },
    }
}
</script>
<style scoped>
    .box-card {
        width: 40vw;
        height: 54vh;
        background: rgba(11,53,115,0.2);
        border: none;
        border-radius: 5px;
        float: left;
    }
    .el-menu{
        border:none;
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
     .el-form /deep/ .el-select /deep/ .el-input__inner{
         color: #fff;
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

</style>