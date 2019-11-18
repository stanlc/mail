<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>设备绑定</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="设备名称：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>
                <el-form-item label="设备正品码：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>  
                <el-form-item label="订阅账号：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>                                              
                <el-form-item label="同步状态：">
                    <el-select v-model="searchForm.applayStatus">
                        <el-option label="已同步" value=3></el-option>
                        <el-option label="未同步" value=2></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备备注：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>                
                <el-form-item>
                    <el-button type="primary" @click="searchAccount" size="small">查询</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="bindVisible=true" size="small">绑定设备</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="unbindVisible=true" size="small">解绑设备</el-button>
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
                width="auto">
                </el-table-column>
                <el-table-column
                label="序号"
                type="index"
                width="auto">
                </el-table-column>
                <el-table-column
                label="设备名称"
                prop="account"
                width="150"
                
                >
                </el-table-column>                
                <el-table-column
                label="设备备注"
                prop="applayStatus"
                width="auto"
                :formatter="status"
                >               
                </el-table-column>
                <el-table-column
                label="设备序列号"
                prop="applayStatus"
                width="auto"
                >               
                </el-table-column>
                <el-table-column
                label="设备正品码"
                prop="applayStatus"
                width="auto"
                >               
                </el-table-column>
                <el-table-column
                label="订阅账号"
                prop="applayStatus"
                width="auto"
                >               
                </el-table-column>  
                <el-table-column
                label="同步状态"
                prop="applayStatus"
                width="auto"
                >               
                </el-table-column>               
                <el-table-column
                label="上一次调用更新设备时间"
                prop="fechTime"
                width="175"
                :formatter="formatTime"
                >
                </el-table-column>  
                <el-table-column
                label="操作"
                fixed="right"
                width="390"
                >
                    <template class="btn-box">
                        <el-button type="info" size="mini">详情</el-button>
                        <el-button type="primary" size="mini">编辑</el-button>
                        <el-button type="primary" size="mini">解绑设备</el-button>
                        <el-button type="primary" size="mini">同步设备</el-button>
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
                    <el-select v-model="addAccountForm.provCode" @change="choseProvince" placeholder="省级地区">
                        <el-option v-for="item in province" :key="item.index" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="cname" @change="choseCity" placeholder="市级地区">
                        <el-option v-for="item in city" :key="item.index" :label="item.value" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="bname" @change="choseBlock" placeholder="区级地区">
                        <el-option v-for="item in block" :key="item.index" :label="item.value" :value="item.id"></el-option>
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
            <el-dialog
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
            </el-dialog>            
            <!-- 绑定已有订阅账号dialog -->            
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
            addOldAccountForm:{},
            ChineseDistricts:ChineseDistricts,
            province:[],
            city:[],
            block:[],
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
        this.getCityData()
    },
    methods:{
        deviceSelect(e){ 
            this.selectAccounts = e
            this.selectAccount = e[0]
            console.log(this.selectAccounts)
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
        //省市区
        getCityData(){
            let that = this;
            that.ChineseDistricts.forEach(function(item,index){
            //省级数据
              that.province.push({id: item.code, value: item.name, children: item.cityList})
            })
        },  
        // 选省

        choseProvince:function(e) {
            let that = this;
            that.city = [];
            that.block = [];
            that.cname = '';
            that.bname = '';
            for (var index2 in that.province) {
                 if (e === that.province[index2].id) {
                    that.shi1 = that.province[index2].children
                    that.addAccountForm.provCode = that.province[index2].id
                    that.shi1.forEach(function(citem,cindex){
                    that.city.push({id:citem.code,value: citem.name, children: citem.areaList})
                    })
                    }
                }
        },   
        
        // 选市

        choseCity:function(e) {
                let that = this;
                that.block = [];
                that.cname = '';
                for (var index3 in that.city) {
                if (e === that.city[index3].id) {
                that.qu1 = that.city[index3].children
                that.cname = that.city[index3].value
                that.addAccountForm.cityCode = that.city[index3].id
                that.E = that.qu1[0].id
                that.qu1.forEach(function(bitem,bindex){
                that.block.push({id:bitem.code,value: bitem.name, children: []})
                })
                 }
                }
            },

             // 选区

        choseBlock:function(e) {
            this.addAccountForm.areaCode = e
        }, 
        //添加账号
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
        //绑定已有订阅账号
        addOldAccount(){
            this.$http.post(`/account/applyAccount/${this.addOldAccountForm.account}`).then(res=>{
                console.log(res)
                this.addOldAccountVisible = false
            })
            
        },
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
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input{
         width:150px;
     }
     .el-select{
         width: 150px;
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
     .btn-box .el-button{
         width: 5rem;
     }
</style>