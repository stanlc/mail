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
                    <el-button type="primary" @click="exportExcel">导出</el-button>
                </el-form-item>                                                                             
            </el-form>
            <el-table
            :data="tabelList"
            style="width: 100%"
            @select="deviceSelect"
            @check-change="CheckChange"
            id="LogTable"
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
                :formatter="positionFormat"
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
                fixed="right"
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
                'pageSize':5,
            },
            pageInfo:{},
            currentPage: 1,
            pagesize:5,
            totalCount:0,
            totalPage:0,
            pageNum:1,
            pageSize:5,
            tabelList:[],
            logList:[],
            organList:[],
            deviceInfo:{},
            deviceNumList:[],
            Dates:[],
            valueId:0,
            checkInfoVisible:false,
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },

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
            if(this.logList){
                let numList = [],timeList = []
                this.logList.map(item=>numList.push(item.deviceNum))   //获取设备Num数组
                this.logList.map(item=>timeList.push(item.createTime))
                let uniNumList = Array.from(new Set([...numList]))   //去重
                let uniTimeList = Array.from(new Set([...timeList]))   //去重
                uniTimeList.map(item=> this.Dates.push({'value':item}))
                uniNumList.map(item=> this.deviceNumList.push({'value':item}))
            }
            this.Dates.map(item=>item.label=this.createTime(item.value))
            this.getList(this.searchForm)
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
        positionFormat(row){
            let val = row.position
            let varr = val.split(',')
            if(varr[1]){
                return varr[1]+'-'+varr[0]
            }else{
                return varr[0]
            }
        },        
        // 取值
        getValue(value) {
        this.valueId = value;
        this.searchForm.organId = value
        },
        //查询
        search(){
            this.$http.post('/device/pagerList',this.searchForm).then(res=>{
                this.tabelList = res.data.paging.list
                this.pageInfo = res.data.paging
                this.totalCount = this.pageInfo.totalCount
                this.totalPage = this.pageInfo.totalPage 
            })
            this.searchForm={
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            }
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
            var deviceNumList = this.deviceNumList;
            let unilist = Array.from(new Set(deviceNumList.filter(this.createFilter(queryString))))  
            var results = queryString ? unilist : deviceNumList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (deviceNumList) => {
            return (deviceNumList.value.indexOf(queryString) === 0);
            };
        },        
        handleSelect(item) {
            console.log(item);
        },
        exportExcel () {
        /* generate workbook object from table */
        let wb = XLSX.utils.table_to_book(document.querySelector('#LogTable'));
        /* get binary string as output */
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '操作日志表.xlsx');
        } catch (e)
        {
            if (typeof console !== 'undefined')
                console.log(e, wbout)
        }
        return wbout
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
        background: #06253d;
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
    /* 组状态样式 */
    .boxName{
        display: block;
        width: 38px;
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
</style>