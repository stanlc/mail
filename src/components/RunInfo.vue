<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>运行监测</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="机构名称：" >
                    <select-tree
                    :props="props"
                    :options="organList"
                    :value="valueId"
                    ref="selectTree"
                     @getValue="getValue($event)"
                    v-model="searchForm.organId"
                    ></select-tree>
                </el-form-item>
                <el-form-item label="运行状态：">
                    <el-select v-model="searchForm.openStatus">
                        <el-option label="开" value=1></el-option>
                        <el-option label="关" value=0></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="报警状态：">
                    <el-select v-model="searchForm.alarmStatus">
                        <el-option label="报警" value=1></el-option>
                        <el-option label="正常" value=0></el-option>
                    </el-select>
                </el-form-item>                 -->
                <el-form-item label="设备ID：">
                    <el-autocomplete
                    class="inline-input"
                    v-model="searchForm.deviceNum"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入设备ID"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    ></el-autocomplete>                      
                </el-form-item>   
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>  
                <el-form-item>
                    <el-button type="primary" @click="exportVisible=true">导出</el-button>
                    <el-dialog
                        title="下载表格"
                        :visible.sync="exportVisible"
                        width="25%"
                        >
                        <div style="text-align:center;">
                            <p>是否下载表格</p>
                        </div>
                        <div style="text-align:center;">
                            <el-button type="primary" @click="exportEx">确认</el-button>
                            <el-button type="primary" @click="exportVisible=false">返回</el-button></div>
                        </el-dialog> 
                </el-form-item>                                                                             
            </el-form>
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
                label="设备ID"
                prop="deviceNum"
                >
                </el-table-column>                
                <el-table-column
                label="所在区域"
                prop="position"
                >  
                </el-table-column>             
                <el-table-column
                label="设备名称"
                prop="deviceName"
                >
                </el-table-column>
                <el-table-column
                label="开关状态"
                prop="openStatus"
                :formatter="(row)=>{return row.openStatus===1?'开':'关'}"
                >
                </el-table-column>
                <el-table-column
                label="报警状态"
                prop="alarmStatus"
                :formatter="(row)=>{return row.alarmStatus===1?'报警':'正常'}"
                >
                </el-table-column>                
                <el-table-column
                label="单日操作次数"
                prop="todayNum"
                >
                </el-table-column>     
                <el-table-column
                label="最后操作时间"
                prop="updateTime"
                :formatter="formatTime"
                >
                </el-table-column>                                
            </el-table>

        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total,prev, pager, next, jumper"
            background
            :total="totalCount">
            </el-pagination>
        </div>
    </el-card>
</template>
<script>
import SelectTree from "./SelectTree";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

const delay = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
export default {
    data(){
        return {
            pageNum:1,
            pageSize:8,
            pageInfo:{},
            idList:[],
            tabelList:[],
            exportTabelList:[],
            runInfoList:[],
            organList:[],
            valueId:0,
            currentPage: 1,
            pagesize:8,
            exportVisible:false,
            tableHeight:50,
            xlxurl:'',
            totalCount:0,
            searchForm:{
                'pageNum':1,
                'pageSize':8,
            },
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },
            hide:false,
        }
    },
    components:
       { SelectTree,}
    ,
    created(){
        if(localStorage.organList){
            this.organList = JSON.parse(localStorage.organList)
        }else{
            this.utils.getOrganList(this)
        }
        
    },
    mounted(){
            this.getList(this.searchForm)
           if(localStorage.runInfoList){
               this.runInfoList = JSON.parse(localStorage.runInfoList)
           }else{
               this.$http.post('/monitoring/pagerList',this.searchForm).then(res=>{
                   localStorage.runInfoList = JSON.stringify(res.data.paging.list)
                   this.runInfoList = JSON.parse(localStorage.runInfoList)
                   
               })  
           }
           //获取所有设备Id
            this.$http.post('/monitoring/pagerList',{
                    "pageNum":1,
                    "pageSize":1000
                }).then(res=>{
                    let aList = [],list = res.data.paging.list
                    list.map(item=>aList.push(item.deviceNum))   //获取设备id数组
                    let uniList = Array.from(new Set([...aList]))   //去重
                    uniList.map(item=> this.idList.push({'value':item}))       
            }),
            this.tableChange()            

        },
    methods:{
        deviceSelect(){

        },
        CheckChange(){

        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('/monitoring/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('/monitoring/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        getList(form){
            this.$http.post('/monitoring/pagerList',form
            ).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.pagesize = this.pageInfo.pageSize
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
        },  
        exportEx(){
            let form = Object.assign({},this.searchForm)
            form.pageNum = 1
            form.pageSize = 500
            let that = this
            this.$http.post('/monitoring/export',form).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    this.xlxurl = res.data.data
                    this.exportVisible = false
                    this.openurl()
                }
            })
        }, 
        openurl(){
            
                if (!!window.ActiveXObject || "ActiveXObject" in window){
                    window.open(this.xlxurl)
                }else{
                        this.$http({method:'get',url:this.xlxurl, responseType:'blob'}).then(res=>{
                        console.log("response: ", res);
                        // new Blob([data])用来创建URL的file对象或者blob对象
                        let url = window.URL.createObjectURL(new Blob([res.data])); 
                        // 生成一个a标签
                        let link = document.createElement("a");
                        link.style.display = "none";
                        link.href = url;
                        // 生成时间戳
                        let arr = this.xlxurl.split('/')
                        let filename = arr.pop()
                        link.download = filename;   
                        document.body.appendChild(link);
                        link.click();
                        })
                }

        },        
        //内容格式化

        formatTime(row){
            let val = row.lastDate
            let date = new Date(val) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
            let D = date.getDate() + ' '
            let h = date.getHours() + ':'
            let m = date.getMinutes() + ':'
            let s = date.getSeconds()
            if(Y==='1970-'){
                return '未操作'
            }
            return Y+M+D+h+m+s            
        },
        positionFormat(row){
            let val = row.position
            let varr = val.split(',')
            if(varr[1]){
                return varr[1]+'-'+varr[0]
            }else{
                return varr[0]
            }
            
        },
        search(){
            this.searchForm.pageNum = 1
            this.$http.post('/monitoring/pagerList',this.searchForm).then(res=>{
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
                    this.$refs.selectTree.clearHandle()  
                }
                 
            })            
            
        },  
        clear(){
            this.$refs.selectTree.clearHandle()
            this.searchForm={
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            },
            this.getList(this.searchForm)           
        },
        // 取值
        getValue(value) {
        this.valueId = value;
        this.searchForm.organId = value
        }, 
        //输入建议
        querySearch(queryString, cb){
            var list =  this.idList;
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
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 240;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 240
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
      .el-form /deep/ .el-input__inner{
      color: #fff
    } 
</style>