<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>账号订阅</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="订阅账号：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>
                <el-form-item label="设备状态：">
                    <el-select v-model="searchForm.applayStatus">
                        <el-option label="订阅成功" value=3></el-option>
                        <el-option label="审核中" value=2></el-option>
                        <el-option label="申请中" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchAccount">查询</el-button>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form :inline="true">
                <!-- <el-form-item>
                    <el-button type="primary" @click="addOldAccountVisible=true">绑定已有订阅账号</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="addAccountDialogVisible=true">创建新的订阅账号</el-button>
                </el-form-item>                
            </el-form>
            <el-table
            :data="accountList"
            style="width: 100%"
            @select="deviceSelect"
            @check-change="CheckChange"
            >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="序号"
                type="index"
                width="100">
                </el-table-column>
                <el-table-column
                label="订阅账号"
                prop="account"
                width="200"
                
                >
                </el-table-column>                
                <el-table-column
                label="订阅状态"
                prop="applayStatus"
                width="160"
                :formatter="status"
                >               
                </el-table-column>             
                <el-table-column
                label="上一次调用更新设备时间"
                prop="fechTime"
                :formatter="formatTime"
                width="240"
                >
                </el-table-column>  
                <el-table-column
                label="操作"
                fixed="right"
                width="auto"
                >
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="openInfo(scope.row)">详情</el-button>
                        <el-button type="primary" size="mini" @click="sub(scope.row)" :disabled="scope.row.applayStatus===3">订阅</el-button>
                        <el-button type="primary" size="small" :disabled="scope.row.applayStatus===1">同步设备</el-button>
                        <el-button type="danger" size="mini">删除</el-button>                        
                    </template>                
                </el-table-column>                                
            </el-table>
            <!-- 新增订阅账号dialog -->
            <el-dialog
            title="创建新的订阅账号"
            :visible.sync="addAccountDialogVisible"
            width="40%"
            :model="addAccountForm">
            <el-form :inline="true">
                <el-form-item label="所在地区：">
                    <el-select v-model="addAccountForm.provCode" @change="changeProvince" placeholder="省级地区">
                        <el-option v-for="item in province" :key="item.index" :label="item.areaName" :value="item.areaCode"></el-option>
                    </el-select>
                    <el-select v-model="addAccountForm.cityCode" @change="changeCity" placeholder="市级地区">
                        <el-option v-for="item in city" :key="item.index" :label="item.areaName" :value="item.areaCode"></el-option>
                    </el-select>
                    <el-select v-model="addAccountForm.areaCode" @change="changeArea" placeholder="区级地区">
                        <el-option v-for="item in area" :key="item.index" :label="item.areaName" :value="item.areaCode"></el-option>
                    </el-select>                                        
                </el-form-item>
            </el-form>            
            <el-form :inline="true" label-position="right" label-width="auto">
                <el-form-item label="账号名称：">
                    <el-input v-model="addAccountForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="账号密码：">
                    <el-input v-model="addAccountForm.password"></el-input>
                </el-form-item>  
                <el-form-item label="账号邮箱：">
                    <el-input v-model="addAccountForm.email"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：">
                    <el-input v-model="addAccountForm.idNo"></el-input>
                </el-form-item>   
                <el-form-item label="手机号码：">
                    <el-input v-model="addAccountForm.userPhone"></el-input>
                </el-form-item>                                              
            </el-form>
            <el-form :inline="true">
              
            </el-form>            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addAccount">确定</el-button>
                <el-button type="primary" @click="addAccountDialogVisible =false">取消</el-button>
            </span>
            </el-dialog>            
            <!-- 新增订阅账号dialog -->
            <!-- 绑定已有订阅账号dialog -->
            <!-- <el-dialog
            title="绑定已有订阅账号"
            :visible.sync="addOldAccountVisible"
            width="30%"
            :model="addOldAccountForm">
            <el-form label-position="right" label-width="auto">
                <el-form-item label="订阅账号：">
                    <el-input v-model="addOldAccountForm.account" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账号描述：">
                    <el-input v-model="addOldAccountForm.userName" size="small"></el-input>
                </el-form-item>                                            
            </el-form>       
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOldAccount">确定</el-button>
                <el-button type="primary" @click="addOldAccountVisible =false">取消</el-button>
            </span>
            </el-dialog>             -->
            <!-- 绑定已有订阅账号dialog -->
            <!-- 账号详情dialog -->
            <el-dialog
            title="账号详情"
            :visible.sync="accountInfoVisible"
            width="30%"
            :model="accountInfoForm">
                <div class="info">
                    账号名称：{{accountInfoForm.account}}
                    <br><br>
                    登录名称：{{accountInfoForm.userName}} 
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="accountInfoVisible =false">确定</el-button>
            </span>
            </el-dialog>            
            <!-- 账号详情dialog -->                        
        </div>
    </el-card>
</template>
<script>
import ChineseDistricts from '../js/distpicker.data'
export default {
    data(){
        return {
            addAccountDialogVisible:false,
            addOldAccountVisible:false,
            accountInfoVisible:false,
            accountId:0,
            selectAccount:[],
            selectAccount:{},
            searchForm:{
                'account':'',
                'applayStatus':''
            },
            accountList:[
                {
                    'name':'aa',
                    'organName':'bb'
                }
            ],
            addAccountForm:{
                'apId':'123',
                'gender':0
            },
            // addOldAccountForm:{},
            accountInfoForm:{},
            ChineseDistricts:ChineseDistricts,
            province:[],
            city:[],
            area:[],
            shi1:[],
            qu1:[],
            city:'',
            block:'',
            pname:'',
            cname:'',
            bname:'',
        }
    },
    mounted(){
        this.utils.getSubAccount(this,{
            "pageNum": 1,
            "pageSize": 8
        })
        
    },
    created(){
         this.utils.getProv().then(res=>{this.province = res.data.data})
    },
    methods:{
        deviceSelect(e){ 
            this.selectAccounts = e
            this.selectAccount = e[0]
            console.log(this.selectAccounts)
        },
        openInfo(row){
            this.accountInfoVisible=true
            this.accountInfoForm = row
        },
        CheckChange(){

        },
        //内容格式化
        //状态格式化
        status(row){
            let v = row.applayStatus
            if(v===1){
                return '申请中'
            }else if(v ===2){
                return '审核中'
            }else{
                return '订阅成功'
            }
        },
        //时间格式化
        formatTime(row){
            let val = row.fechTime
            let date = new Date(val) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
            let D = date.getDate() + ' '
            let h = date.getHours() + ':'
            let m = date.getMinutes() + ':'
            let s = date.getSeconds()
            if(Y==='1970-'){
                return "设备未调用"
            }else{
                return Y+M+D+h+m+s    
            }
                    
        },
        //添加账号
        changeProvince(){
            let id =0
            if(this.addAccountForm.provCode){
                id = this.province[this.province.findIndex((item)=>{return item.areaCode===this.addAccountForm.provCode})].id
            }
            this.utils.getCity(id).then(res=>{
                this.city = res.data.data
            })            
        },
        changeCity(){
            let id =0
            if(this.addAccountForm.cityCode){
                id = this.city[this.city.findIndex((item)=>{return item.areaCode===this.addAccountForm.cityCode})].id
            }            
            this.utils.getArea(id).then(res=>{
                this.area = res.data.data
            }) 
        },
        changeArea(){
            console.log(this.addAccountForm.areaCode)
        },
        addAccount(){
            let that = this 
            this.$http.post('/account/apply',this.addAccountForm).then(res=>{
                        that.utils.getSubAccount(that,{
                            "pageNum": 1,
                            "pageSize": 8
                        })
            })
            this.addAccountDialogVisible =false
        },
        //筛选
        searchAccount(){
            this.utils.getSubAccount(this,this.searchForm)
        },
        clear(){
            this.utils.getSubAccount(this,{
                "pageNum": 1,
                "pageSize": 8
            })            
        },
        //订阅
        sub(row){
            this.$http.post(`/account/subscrip/${row.id}`).then(res=>{
                if(res.code===200){
                    this.$message({
                        type:'success',
                        message:'订阅成功'
                    })
                }
            })
        },
        //绑定已有订阅账号
        // addOldAccount(){
        //     this.$http.post(`/account/applyAccount/${this.addOldAccountForm.account}`).then(res=>{
        //         console.log(res)
        //         this.addOldAccountVisible = false
        //     })
            
        // },
    }
}       
</script>
<style scoped>
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
        margin: 0px auto;
    } 
    .el-dialog__body.info{
        color: #fff
    }
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input{
         width:150px;
     }
     .el-select{
         width: 120px;
         margin-right: 10px;
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