<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>设备管理</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <!-- <el-form-item label="设备类型：">
                    <el-input v-model="searchForm.type"></el-input>
                </el-form-item> -->
                <el-form-item label="设备名称：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.deviceName"
                    :fetch-suggestions="NamequerySearch"
                    placeholder="请输入设备名称"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    ></el-autocomplete> 
                </el-form-item> 
                <el-form-item label="设备状态：">
                    <el-select v-model="searchForm.status">
                        <el-option label="打开" value=1></el-option>
                        <el-option label="关闭" value=0></el-option>
                        <el-option label="无状态" value=2></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅账号：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.deviceAccount"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入订阅账号"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    ></el-autocomplete>                     
                </el-form-item>  
                <el-form-item label="所属机构：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.organName"
                    :fetch-suggestions="OrganquerySearch"
                    placeholder="请输入所属机构"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>  
                <el-form-item label="所在位置：">
                        <el-input v-model="searchForm.devicePosition" placeholder="请输入详细地址"></el-input>
                </el-form-item>                                                                                                       
            </el-form>
            <el-form>
                <el-form-item>      
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>
            </el-form>
                         
            <el-form>
                <el-button type="primary" @click="configOrgan" :disabled="selectDevices.length!==1" >配置机构</el-button>
                <!-- <el-button type="primary" @click="configPosition" :disabled="selectDevices.length!==1">配置位置</el-button> -->
            </el-form>
            <!-- 设备详情dialog -->
            <el-dialog
            title="设备详情"
            :visible.sync="InfoVisible"
            width="30%">
                <div class="info">
                    设备名称：{{rowInfo.deviceName}}
                    <br><br>
                    设备序列号：{{rowInfo.deviceNum}}
                    <br><br>
                    订阅账号：{{rowInfo.deviceAccount}}
                    <br><br>
                    设备MAC：{{rowInfo.deviceMac}}
                    <br><br>
                    所属机构：{{rowInfo.organName}}
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="InfoVisible =false">返回</el-button>
            </span>
            </el-dialog>            
            <!-- 设备详情dialog -->  
            <!-- 编辑设备dialog -->
            <el-dialog
            title="编辑设备"
            :visible.sync="configDeviceDialogVisible"
            width="35%"
            :model="configDeviceForm"
            class="bind"
            >
                <el-form label-position="right" label-width="auto">
                    <el-form-item label="设备别名：">
                        <el-input v-model="configDeviceForm.aliasName" ></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址：">
                        <el-input v-model="configDeviceForm.devicePosition" ></el-input>
                    </el-form-item>   
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-form :inline="true">
                        <el-button type="primary" @click="configDevice">确定</el-button>
                        <el-button type="primary" @click="configDeviceDialogVisible =false;configDeviceForm={}">取消</el-button>
                    </el-form>  
                </span>
            </el-dialog>            
            <!-- 编辑设备dialog --> 
            <!-- 配置机构dialog -->
            <el-dialog
            title="配置机构"
            :visible.sync="configOrganVisible"
            width="25%"
            :model="configOrganForm"
            class="bind"
            >
                <el-form label-position="right" label-width="auto">
                    <el-form-item label="机构名称：" >
                        <select-tree
                        :props="props"
                        :options="organList"
                        :value="valueId"
                        ref="selectTree"
                        @getValue="getValue($event)"
                        v-model="configOrganForm.organId"
                        ></select-tree>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-form :inline="true">
                        <el-button type="primary" @click="editOrgan">确定</el-button>
                        <el-button type="primary" @click="configOrganVisible =false;$refs.selectTree.clearHandle()">取消</el-button>
                    </el-form>  
                </span>
            </el-dialog>            
            <!-- 配置机构dialog -->                                         
            <el-table
            :data="tabelList"
            style="width: 100%"
            @select="deviceSelect"
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
                label="设备名称"
                prop="deviceName"
                width="180"
                >
                </el-table-column>
                <el-table-column
                label="设备别名"
                prop="aliasName"
                >
                </el-table-column>                  
                <el-table-column
                label="设备状态"
                prop="status"
                :formatter="status"
                >               
                </el-table-column>
                <el-table-column
                label="序列MAC"
                prop="deviceMac"
                >
                </el-table-column>                 
                <el-table-column
                label="订阅账号"
                prop="deviceAccount"
                >
                </el-table-column>
                <el-table-column
                label="所属机构"
                prop="organName"
                >
                </el-table-column> 
                <el-table-column
                label="详细地址"
                prop="devicePosition"
                >
                </el-table-column>     
                <el-table-column
                label="操作"
                
                >
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="openInfo(scope.row)">详情</el-button>
                        <el-button type="primary" size="mini" @click="openConfig(scope.row)">编辑</el-button>
                    </template>                
                </el-table-column>                                
            </el-table>
        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15,20]"
            :page-size="pagesize"
            layout="total, prev, pager, next, sizes,jumper"
            background
            :total="totalCount">
            </el-pagination>
        </div>
    </el-card>
</template>
<script>
import SelectTree from "./SelectTree";
export default {
    data(){
        return {
           
            pageNum:1,
            pageSize:10,
            deviceList:[],
            accountList:[],
            organList:[],
            tabelList:[],
            allOrganList:[],
            accList:[],
            nameList:[],
            orgList:[],
            valueId:0,
            pageInfo:{},
            currentPage: 1,
            pagesize:10,
            totalCount:0,
            totalPage:0,
            tableHeight:50,
            searchForm:{
                "pageNum": this.pageNum,
                "pageSize": this.pageSize
            },
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },
            InfoVisible:false,
            rowInfo:{},
            configorigin:{},
            selectDevices:[],
            configDeviceForm:{},
            configOrganForm:{},
            configDeviceDialogVisible:false,
            configOrganVisible:false,
        }
    },
    components:{
        SelectTree,
    },
    created(){
        this.utils.getDeviceList(this,this.searchForm)
        this.utils.getOrganList(this)
    },
    mounted(){
        if(localStorage.subAccountList){
            this.accountList = JSON.parse(localStorage.subAccountList)
        }else{
             this.utils.getSubAccount(this,{pagNum:1,pageSize:500})
        }
        if(localStorage.organList){
            this.organList = JSON.parse(localStorage.organList)
        }
        
        
        this.getList(this.searchForm)
        this.tableChange()
        this.$http.post('/device/pagerList',{
                "pageNum":1,
                "pageSize":1000
            }).then(res=>{
                let aList = [],list = res.data.paging.list
                list.map(item=>aList.push(item.deviceAccount))   //获取account数组
                let uniList = Array.from(new Set([...aList]))   //去重
                uniList.map(item=> this.accList.push({'value':item})) 
                let bList = []
                list.map(item=>bList.push(item.deviceName))   //获取设备名称数组
                let unbiList = Array.from(new Set([...bList]))   //去重
                unbiList.map(item=> this.nameList.push({'value':item}))   
                let cList = []
                list.map(item=>cList.push(item.organName))   //获取组织机构数组
                let unciList = Array.from(new Set([...cList]))   //去重
                unciList.map(item=> this.orgList.push({'value':item}))  
                    
        })         

        
    },
    methods:{
        deviceSelect(e){
            this.selectDevices = e
            this.configOrganForm.deviceId = e[0].id
        },
        CheckChange(){

        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('/device/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('/device/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },        
        getList(form){
            this.$http.post('/device/pagerList',form
            ).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.pagesize = this.pageInfo.pageSize
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
        },
        status(row){
                if(row.status===1){
                    return '开启'
                }else if(row.status===0){
                    return '关闭'
                }else{
                    return '无状态'
                }
        },
        //筛选
        search(){
            this.searchForm.pageNum = 1
            this.$http.post('/device/pagerList',this.searchForm).then(res=>{
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
        //详情
        openInfo(row){
            this.InfoVisible = true
            this.rowInfo = row
        },
        //编辑
        openConfig(row){
            this.configDeviceDialogVisible = true
            this.configorigin = row
            this.configDeviceForm = Object.assign({},row)
            
            // this.configDeviceForm.aliasName = row.aliasName
            // this.configDeviceForm.devicePosition = row.devicePosition
            // this.configDeviceForm.id = row.id
        },
        //配置设备
        configDevice(){

            this.$http.post('device/update/',this.configDeviceForm).then(
                ()=>{
                    this.getList(this.searchForm)
                    this.configDeviceDialogVisible = false
                }
            )
        },
        //配置机构
        configOrgan(){
            this.configOrganVisible = true
            this.allOrganList = this.utils.getAllNode(this.organList,'childrenList')
        },
        
       
        editOrgan(){
            this.$http.post('device/organ/',this.configOrganForm).then(res=>{
                if(res.data.code==200){
                    this.$message({type:'success',message:'配置机构成功'})
                    this.$refs.selectTree.clearHandle()
                    this.configOrganForm.organName = null
                    this.configOrganVisible = false
                    this.getList(this.searchForm)
                }
            })
            
        },
        //配置位置
        // configPosition(){

        // },
        //设备编辑
        choseAccount(e){
            console.log(e)
        },
        getValue(value) {
            
            this.valueId = value;
            this.configOrganForm.organId = value
            if(value){
                this.configOrganForm.organName = this.allOrganList.filter(item=>item.id===value)[0].organName
            }
        },
        //输入建议
        querySearch(queryString, cb){
            var list =  this.accList;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        NamequerySearch(queryString, cb){
            var list =  this.nameList;
            var results = queryString ? list.filter(this.createFilter(queryString)) : list;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        OrganquerySearch(queryString, cb){
            var list =  this.orgList;
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
        tableChange(){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 0.3*window.innerHeight;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 0.3*window.innerHeight
            }
        })
        //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
　　　　 //240表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度　
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
        width: 97vw;
        height: 78vh;
        /* background: #06253d; */
        background: rgba(11,53,115,0.2);
        border: none;
        border-radius: 5px;
        margin: 20px auto;
        position: relative;
    } 
     .bind .el-input,.bind .el-select{
         width: 200px;
     }    
    .page{
        position: absolute;
        bottom: 20px;
    }
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input,.el-select,.el-autocomplete{
         width:150px;
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
      .el-form /deep/ .el-input__inner{
      color: #fff
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
         color: #fff;
     }
     .box-card /deep/ .el-dialog__footer{
         background: #143666;
     }
</style>