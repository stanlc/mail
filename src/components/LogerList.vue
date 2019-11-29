<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>操作日志</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="所在机构：">
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
                <el-form-item label="开始时间：">
                    <el-select v-model="searchForm.startTime">
                        <el-option
                        v-for="item in Dates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @change="changeT(e)"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="结束时间：">
                    <el-select v-model="searchForm.endTime">
                        <el-option
                        v-for="item in Dates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @change="changeT(e)"></el-option>
                    </el-select>
                </el-form-item>                                     
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>  
                <el-form-item>
                    <!-- <a href="/logger/export?x-user-token=8ba228d89a824282a8715dc9e01a29d8">aaa</a> -->
                    <el-button type="primary" @click="exportVisible=true">导出</el-button>
                        <el-dialog
                        title="下载表格"
                        :visible.sync="exportVisible"
                        width="25%"
                        >
                        <div style="text-align:center;">
                            <p>是否下载表格</p>
                        </div>
                        <div class="center">
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
                label="运作状态"
                prop="openStatus"
                :formatter="(row)=>{return row.openStatus===1?'开':'关'}"
                >
                </el-table-column>    
                <el-table-column
                label="创建时间"
                prop="createTime"
                :formatter="formatTime"
                >
                </el-table-column> 
                <el-table-column
                label="操作"
                width="200"
                >
                    <template class="btn-box" slot-scope="scope">
                        <el-button type="primary" size="mini" @click="checkInfo(scope.row)">查看</el-button>                     
                    </template>                
                </el-table-column>                                                 
            </el-table>
                     
            <!-- 位置dialog开始 -->
            <el-dialog
            title="位置"
            :visible.sync="checkInfoVisible"
            width="25%"
            >
            <div>
                <p> 联系人：{{deviceInfo.organPerson}}</p>
                <p>位置：{{deviceInfo.position}}</p>
                <p>状态：开启{{deviceInfo.openStatusNum}}/关闭{{deviceInfo.offStatusNum}}</p>
                <p>箱体数量：{{deviceInfo.totalNum}}</p>
                <div class="groupBox center">
                    <div v-for="item in deviceInfo.groupInfoList" :key="item.index" class="groupItem">
                        <span class="boxName">{{item.positionDetail|boxposition}}</span>
                        <p :class="item.openStatus===1?'green':'red'">{{item.openStatus|openStat}}</p>
                    </div>
                </div>
            </div>
            <div class="center"><el-button type="primary" @click="checkInfoVisible=false">返回</el-button></div>
            </el-dialog>            
            <!-- 位置dialog结束 -->
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
import SelectTree from "./SelectTree";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
    data(){
        return {
            searchForm:{
                'pageNum':1,
                'pageSize':8,
            },
            pageInfo:{},
            currentPage: 1,
            pagesize:8,
            totalCount:0,
            totalPage:0,
            pageNum:1,
            pageSize:8,
            tableHeight:50,
            tabelList:[],
            exportTabelList:[],
            logList:[],
            organList:[],
            deviceInfo:{},
            deviceNumList:[],
            Dates:[],
            valueId:0,
            checkInfoVisible:false,
            exportVisible:false,
            xlxurl:'',
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },
            hide:false,
        }
    },
    
    filters:{
        openStat(e){
            if(e===1){
                return '开启'
            }else{
                return '关闭'
            }
        },
        boxposition(e){
            if(!e){
                return '未知'
            }else{
                return e
            }
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
        
        if(localStorage.logList){
            this.logList = JSON.parse(localStorage.logList)
        }else{
            this.utils.getLogger(this,this.searchForm)
        }        
    },    
    mounted(){
             this.$http.post('/logger/pagerList',{
                "pageNum":1,
                "pageSize":1000
            }).then(res=>{
                let aList = [],list = res.data.paging.list
                list.map(item=>aList.push(item.deviceNum))   //获取id数组
                let uniList = Array.from(new Set([...aList]))   //去重
                uniList.map(item=> this.deviceNumList.push({'value':item})) 
                let bList = []
                list.map(item=>bList.push(item.createTime))   //获取time数组
                let unbiList = Array.from(new Set([...bList]))   //去重
                unbiList.map(item=> this.Dates.push({'label':this.createTime(item),'value':item}))        
            }) 
            this.getList(this.searchForm)
            this.tabelChange()
        },
    methods:{
        deviceSelect(){

        },
        CheckChange(){

        },
        changeT(e){
            this.searchForm.endTime = e.value
        },
        //分页
        handleSizeChange(val) {
            this.pagesize = val
            this.searchForm.pageSize = val 
            this.$http.post('/logger/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchForm.pageNum = val
            this.$http.post('/logger/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
            })
        },        
        getList(form){
            this.$http.post('/logger/pagerList',form
            ).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.currentPage = this.pageInfo.currentPage
                this.pagesize = this.pageInfo.pageSize
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
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
            if(Y==='1970-'){
                return '未操作'
            }
            return Y+M+D+h+m+s            
        },
        createTime(e){
            let date = new Date(e) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
        // positionFormat(row){
        //     let val = row.position
        //     if(val){
        //        let varr = val.split(',') 
        //     }
            
        //     if(varr[1]){
        //         return varr[1]+'-'+varr[0]
        //     }else{
        //         return varr[0]
        //     }
        // },        
        // 取值
        getValue(value) {
        this.valueId = value;
        this.searchForm.organId = value
        },
        //查询
        search(){
            this.$http.post('/logger/pagerList',this.searchForm).then(res=>{
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
            this.$refs.selectTree.clearHandle()                    
        }, 
        clear(){
            this.$refs.selectTree.clearHandle()//清空selectTree选项
            this.searchForm={
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            }
            this.getList(this.searchForm)
        },
        //查看位置
        checkInfo(e){
            this.checkInfoVisible =true
            this.utils.getDeviceGroup(this,e.deviceNum)
            
        },
        //输入建议
        querySearch(queryString, cb){
            var list = this.deviceNumList;
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
            console.log(item);
        },
        exportEx(){
            let form = Object.assign({},this.searchForm)
            form.pageNum = 1
            form.pageSize = 500
            this.$http.post('/logger/export',form).then(res=>{
                if(res.data.code===200){
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    // this.xlxurl = res.data.data
                    // console.log(res.data.data)
                    this.exportVisible = false
                    this.xlxurl = res.data.data
                     this.openurl()
                }
            })
        }, 
        openurl(){
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
                link.download = filename + ".xls";   
                document.body.appendChild(link);
                link.click();
             })
        },
        fetchExportBill(url, data = {}) {
            return new Promise((resolve, reject) => {
            this.$http.post(url,data,{ responseType: 'arraybuffer'}).then(res => {
            //resolve(res)
            let blob = new Blob([res], {type: "application/vnd.ms-excel"}); 
        　　let objectUrl = URL.createObjectURL(blob); 
        　　 window.location.href = objectUrl; 
            }).catch(error => {
                if (data.Vue) {
                data.Vue.$message.error('系统异常');
                }
                reject(null, error);
            })
            })
        }, 
        handleExport(row){
            const url="/logger/export"
            const options = {}
            this.exportExcel(url,options)
        }, 
        exportExcel(url, options = {}) {
        return new Promise((resolve, reject) => {
            console.log(`${url} 请求数据，参数=>`, JSON.stringify(options))
            this.$http.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
            this.$http({
            method: 'post',
            url: url, // 请求地址
            data: options, // 参数
            responseType: 'blob' // 表明返回服务器返回的数据类型
            }).then(
            response => {
                resolve(response.data)
                let blob = new Blob([response.data], {
                type: 'application/vnd.ms-excel'
                })
                console.log(blob)
                let fileName = Date.parse(new Date()) + '.xlsx'
                if (window.navigator.msSaveOrOpenBlob) {
                // console.log(2)
                navigator.msSaveBlob(blob, fileName)
                } else {
                // console.log(3)
                var link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = fileName
                link.click()
                //释放内存
                window.URL.revokeObjectURL(link.href)
                }
            },
            err => {
                reject(err)
            }
            )
        })
        },
        //tabel高度
        tabelChange(){
        this.$nextTick(function () {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 240;
            
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 240
            }
        })
        //this.$refs.table.$el.offsetTop：表格距离浏览器的高度
　　　　 //50表示你想要调整的表格距离底部的高度（你可以自己随意调整），因为我们一般都有放分页组件的，所以需要给它留一个高度　
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
    .el-input /deep/ .el-input__inner{
        background: none;
        height: 30px;
        color: #fff;
    }
      .el-form /deep/ .el-input__inner{
      color: #fff
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

    .center{
        text-align: center;
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
    /* 组状态样式 */
    .boxName{
        display: block;
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: #09aec2;
        border-radius: 5px;
        font-size: 10px; 
    }  
    .groupBox{
        display: block;
        width: 300px;
        height: 170px;
        overflow-y: scroll;
        margin-bottom: 40px;
        border-bottom: #fff 1px solid
    }
    .groupItem{
        display: inline-block;
        text-align: center;
        margin:0 10px 0 0;
    }   
    .green{
        color: #15b789
    }
    .red{
        color: #e04b4c
    }
    .groupBox::-webkit-scrollbar {/*滚动条整体样式*/
        width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 150px;
    }
    .groupBox::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 10px;
            background: #0bb6cf;
        }
    .groupBox::-webkit-scrollbar-track {/*滚动条里面轨道*/
            
            border-radius: 10px;
            background: #1b4887;
        }
          body{
              /*ie下修改滚动条样式，在webkit内核浏览器无效*/
           /* 三角箭头的颜色  */
           scrollbar-arrow-color: #f4ae21;
           /* *立体滚动条的颜色 */
             scrollbar-face-color: #333;  
            /* 立体滚动条亮边的颜色 */
             scrollbar-3dlight-color: #666; 
            /* 滚动条空白部分的颜色 */
            scrollbar-highlight-color: #1b4887; 
        /* 立体滚动条阴影的颜色  */
            scrollbar-shadow-color: #1b4887; 
        /* 立体滚动条强阴影的颜色 */
            scrollbar-darkshadow-color: #666;  
            /* 立体滚动条背景颜色 */
            scrollbar-track-color: #666; 
             /* 滚动条的基本颜色 */
             scrollbar-base-color:#f8f8f8;
       }
</style>