<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>设备绑定</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm" >
                <el-form-item label="设备账号：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.deviceAccount"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入设备账号"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    ></el-autocomplete>   
                </el-form-item>
                <el-form-item label="设备授权码：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.deviceSerial"
                    :fetch-suggestions="SerialquerySearch"
                    placeholder="请输入设备授权码"
                    :trigger-on-focus="false"
                    @select="SerialhandleSelect"
                    ></el-autocomplete>
                </el-form-item> 
                <el-form-item label="正品码：">
                    <el-input v-model="searchForm.genuineCode"></el-input>
                </el-form-item>                                 
                <el-form-item>
                    <el-button type="primary" @click="searchBind" size="small" >查询</el-button>
                    <el-button type="primary" @click="clear" size="small" >重置</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="bindDeviceDialogVisible=true" size="small">绑定设备</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="unBind" size="small">解绑设备</el-button>
                </el-form-item>                
            </el-form>
            <el-table
            :data="tabelList"
            style="width: 100%"
            @select="accountSelect"
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
                label="设备账号"
                prop="deviceAccount"
                width="auto"
                >
                </el-table-column>                
                <el-table-column
                label="授权码"
                prop="deviceSerial"
                width="auto"
                > 
                </el-table-column>
                <el-table-column
                label="正品码"
                prop="genuineCode"
                width="auto"
                >         
                </el-table-column>   
                <el-table-column
                label="绑定时间"
                prop="createTime"
                width="auto"
                :formatter="formatTime"
                >         
                </el-table-column> 
                <el-table-column
                label="操作"
                width="200"
                >
                    <template class="btn-box" slot-scope="scope">
                        <el-button type="info" size="mini" @click="openInfo(scope.row)">详情</el-button>
                        <el-button type="primary" size="mini" @click="SingleUnBind(scope.row)">解绑设备</el-button>                      
                    </template>                
                </el-table-column>                                
            </el-table>
            <!-- 绑定设备dialog -->
            <el-dialog
            title="绑定设备"
            :visible.sync="bindDeviceDialogVisible"
            width="40%"
            :model="bindDeviceForm"
            class="bind"
            >
                <el-form label-position="right" label-width="auto">
                    <el-form-item label="设备账号：">
                        <el-select v-model="bindDeviceForm.deviceAccount" @change="choseAccount" placeholder="请选择设备账号">
                            <el-option v-for="item in accountList" :key="item.index" :label="item.account" :value="item.account"></el-option>
                        </el-select>                                     
                    </el-form-item>
                    <el-form-item label="设备授权码：">
                        <el-input v-model="bindDeviceForm.deviceSerial" ></el-input>
                    </el-form-item>
                    <el-form-item label="正品码：">
                        <el-input v-model="bindDeviceForm.genuineCode" ></el-input>
                    </el-form-item>   
                </el-form>
                <el-form :inline="true">
                    <el-button type="primary" @click="bindDevice">确定</el-button>
                    <el-button type="primary" @click="bindDeviceDialogVisible =false;bindDeviceForm={}">取消</el-button>
                </el-form>  
            </el-dialog>            
            <!-- 绑定设备dialog -->
            <!-- 详情dialog -->
            <el-dialog
            title="详情"
            :visible.sync="infoVisible"
            width="40%"
            class="bind"
            >
            用户名：{{accountInfo.userName}}<br>
            用户邮箱：{{accountInfo.email}}<br>
            <el-button type="primary" @click="infoVisible=false">确定</el-button>  
            </el-dialog>            
            <!-- 详情dialog -->                   
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

export default {
    data(){
        return {
            bindDeviceDialogVisible:false,
            infoVisible:false,
            accountInfo:{},
            bindList:[],
            accountList:[],
            selectAccounts:[],
            right:'right',
            searchForm:{'pageNum':this.pageNum,'pageSize':this.pageSize},
            pageInfo:{},
            currentPage: 1,
            pagesize:4,
            totalCount:0,
            totalPage:0,
            tabelList:[],
            pageNum:1,
            pageSize:4,
            addOldAccountForm:{},
            bindDeviceForm:{},
            accList:[],
            serList:[],
        }
    },
    mounted(){
        this.utils.getbindList(this,this.searchForm)
        this.getAccount()
        this.getList(this.searchForm)
        this.$http.post('/serial/pagerList',{
                "pageNum":1,
                "pageSize":1000
            }).then(res=>{
                let aList = [],sList = [],list = res.data.paging.list
                list.map(item=>aList.push(item.deviceAccount))   //获取account数组
                list.map(item=>sList.push(item.deviceSerial))   //获取account数组
                let uniList = Array.from(new Set([...aList]))   //去重
                let unisList = Array.from(new Set([...sList])) 
                uniList.map(item=> this.accList.push({'value':item}))    
                unisList.map(item=> this.serList.push({'value':item}))         
        })            
    },
    methods:{
        accountSelect(e){
            this.selectAccounts = e
        },
        choseAccount(){

        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('/serial/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('/serial/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },        
        getList(form){
            this.$http.post('/serial/pagerList',form
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
            let val = row.createTime
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
        //详情
        openInfo(row){
            this.infoVisible = true
            let that = this,account = row.deviceAccount,alist = JSON.parse(localStorage.subAccountList)
            let infolist = alist[alist.findIndex(item=>{ return item.account===account})]
            this.accountInfo = infolist
        },
        //获取订阅账号
        getAccount(){
            this.$http.post('/account/pagerList',{ "pageNum": 1,"pageSize": 1000}).then(res=>{this.accountList=res.data.paging.list})
        },
        //绑定设备
        bindDevice(){
            
            this.utils.bindDevice(this.bindDeviceForm).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'绑定成功'
                    })
                }
                this.bindDeviceDialogVisible = false
                this.bindDeviceForm={}
                this.utils.getbindList(this,this.searchForm)
            })
        },
        //解绑设备
        SingleUnBind(row){
            let that = this,account = row.deviceAccount,blist = this.bindList
            let id = blist[blist.findIndex(item=>{ return item.deviceAccount===account})].id
            this.utils.UnBindDevice(id).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'解绑成功'
                    })
                    that.utils.getbindList(that,{
                        "pageNum": 1,
                        "pageSize": 4
                    })
                }
            })
        },
        unBind(){
            this.selectAccounts.forEach(item=>{
                let that = this
                if(item.id!==0){
                    let id = item.id
                    this.utils.UnBindDevice(id).then(res=>{
                        if(res.code===200){
                            this.$message({
                                type:'success',
                                message:'解绑成功'
                            })
                            that.utils.getbindList(that,{
                                "pageNum": 1,
                                "pageSize": 8
                            })
                        }
                    })                    
                }
            })
        },
        //筛选
        searchBind(){
            this.$http.post('/serial/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:'查询成功'
                    })
                }
            })
            this.searchForm = {
                "pageNum": 1,
                "pageSize": 4
            }                        
        },
        clear(){
            this.searchForm = {
                "pageNum": 1,
                "pageSize": 4
            }
            this.getList(this.searchForm)    
        },
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
        //正品码输入建议
        SerialquerySearch(queryString, cb){
            var list =  this.serList;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        SerialcreateFilter(queryString) {
            return (list) => {
            return (list.value.indexOf(queryString) === 0);
            };
        },        
        SerialhandleSelect(item) {
            //console.log(item);
        }                      
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
        /* background: #06253d; */
        border-radius: 5px;
        margin: 0px auto;
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
     .el-input,.el-autocomplete{
         width:150px;
     }
     .bind .el-input,.bind .el-select{
         width: 200px;
     }
     .el-select{
         width: 150px;
         margin-right: 10px;
     }
    .el-form /deep/ .el-form-item__label{
        color: #fff ;
    }
    .el-autocomplete /deep/ .el-input__inner{
        background: none;
        height: 30px;
        color: #fff;
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
    
     .btn-box .el-button{
         width: 5rem;
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
     .sameLevel{
         border-radius: 5px;
     } 
</style>