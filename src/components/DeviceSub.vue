<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>账号订阅</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="订阅账号：">
                        <el-autocomplete
                        class="inline-input"
                        v-model="searchForm.account"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入订阅账号"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        ></el-autocomplete>                    
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
            :data="tabelList"
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
                        <el-button type="primary" size="small" :disabled="scope.row.applayStatus===1" @click="getDevice(scope.row)">同步设备</el-button>
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
                        <el-option v-for="(item,$index) in province" :key="$index" :label="item.areaName" :value="item.areaCode"></el-option>
                    </el-select>
                    <el-select v-model="cityName" @change="changeCity" placeholder="市级地区">
                        <el-option v-for="item in city" :key="item.index" :label="item.areaName" :value="item.areaCode"></el-option>
                    </el-select>
                    <el-select v-model="areaName" @change="changeArea" placeholder="区级地区">
                        <el-option v-for="item in area" :key="item.index" :label="item.areaName" :value="item.areaName"></el-option>
                    </el-select>                                        
                </el-form-item>
            </el-form>            
            <el-form :inline="true" label-position="right" label-width="auto" :rules="rules" ref="ruleForm" :model="addAccountForm">
                <el-form-item label="账号名称：" prop="userName">
                    <el-input v-model="addAccountForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="账号密码：" prop="password">
                    <el-input v-model="addAccountForm.password" type="password" auto-complete="new-password"></el-input>
                </el-form-item>  
                <el-form-item label="账号邮箱：" prop="email">
                    <el-input v-model="addAccountForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idNo">
                    <el-input v-model="addAccountForm.idNo"></el-input>
                </el-form-item>   
                <el-form-item label="手机号码：" prop="userPhone">
                    <el-input v-model="addAccountForm.userPhone" ></el-input>
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
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            background
            :total="totalCount">
            </el-pagination>
        </div>        
    </el-card>
</template>
<script>
import { callbackify } from 'util'

export default {
    
    data(){
        
        return {
            addAccountDialogVisible:false,
            addOldAccountVisible:false,
            accountInfoVisible:false,
            accountId:0,
            selectAccount:[],
            selectAccount:{},
            areaName:'',
            cityName:'',
            searchForm:{
                "pageNum":this.pageNum,
                "pageSize":this.pageSize
            },
            pageInfo:{},
            currentPage: 1,
            pagesize:8,
            totalCount:0,
            totalPage:0,
            pageNum:1,
            pageSize:8,
            tabelList:[],
            accountList:[
            ],
            accList:[],
            addAccountForm:{
                'apId':'123',
                'gender':0
            },
            // addOldAccountForm:{},
            accountInfoForm:{},
            province:[],
            city:[],
            area:[],
            rules: {
                userName:[
                    { required: true, message: '请输入账号名称', trigger: ['blur', 'change'] }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
                ],
                idNo:[{ required: true, message: '请输入身份证号码', trigger: ['blur', 'change'] },
                {
                    pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                    message: '请输入正确的证件号码！',
                    trigger: ['blur', 'change']
                }
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                userPhone: [
                    { required: true, trigger: ['blur', 'change'],message: '请输入手机号码'  },
                    {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号',
                    trigger: ['blur', 'change']}
                ]
            }

        }
    },
    mounted(){
        this.utils.getSubAccount(this,{
                "pageNum":this.pageNum,
                "pageSize":this.pageSize
            })
        this.$http.post('/account/pagerList',{
                "pageNum":1,
                "pageSize":1000
            }).then(res=>{
                let aList = [],list = res.data.paging.list
                list.map(item=>aList.push(item.account))   //获取account数组
                let uniList = Array.from(new Set([...aList]))   //去重
                uniList.map(item=> this.accList.push({'value':item}))           
        })  
        this.getList(this.searchForm)  
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
            console.log(row)
        },
        CheckChange(){

        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('/account/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('/account/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },        
        getList(form){
            this.$http.post('/account/pagerList',form
            ).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.pagesize = this.pageInfo.pageSize
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
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
        
        changeProvince(e){   
            this.city=[],this.area=[]
            this.cityName = ''
            this.areaName = ''
            let id = this.province.filter(item=>item.areaCode===e)[0].id
            this.utils.getCity(id).then(res=>{
                this.city = res.data.data
            })     
        },
        changeCity(e){
            this.area=[]
            this.areaName = ''
            let c = this.city.filter(item=>item.areaCode===e)[0]
            this.addAccountForm.cityCode = e
            this.utils.getArea(c.id).then(res=>{
                this.area = res.data.data
            })
        },
        changeArea(e){
            this.addAccountForm.areaCode = this.area.filter(item=>item.areaName===this.areaName)[0].areaCode
        },
        //添加账号
        addAccount(e){
            let that = this 
            this.$http.post('/account/apply',this.addAccountForm).then(res=>{
                        that.utils.getSubAccount(that,{
                            "pageNum":this.pageNum,
                            "pageSize":this.pageSize
                        })
            })
            this.addAccountDialogVisible =false
        },
        //筛选
        searchAccount(){
            this.$http.post('/account/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
            this.searchForm = {
                "pageNum": 1,
                "pageSize": 4
            }
        },
        clear(){
            this.searchForm = {
                "pageNum": 1,
                "pageSize": 8
            }
            this.getList(this.searchForm)         
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
        //同步设备
        getDevice(e){
            let acc = e.account
            this.$http.post(`/device/getDevice/${acc}`).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'同步设备成功'
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
        //输入建议
        querySearch(queryString, cb){
            var list =  this.accList;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (list) => {
            return (list.value.indexOf(queryString) === 0);
            };
        },        
        handleSelect(item) {
            //console.log(item);
        },
        //输入验证
        
       
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
        border-radius: 5px;
        margin: 0px auto;
        position: relative;
    } 
    .page{
        position: absolute;
        bottom: 20px;
    }
    .el-dialog__body.info{
        color: #fff
    }
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input,.el-autocomplete{
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
    .el-autocomplete /deep/ .el-input__inner{
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