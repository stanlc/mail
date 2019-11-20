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
                    :accordion="isAccordion"
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
                    <el-input v-model="searchForm.deviceNum"></el-input>
                </el-form-item>
                <el-form-item label="最后操作时间：">
                    <el-select v-model="searchForm.lastDate">
                        
                    </el-select>
                </el-form-item>                    
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>  
                <el-form-item>
                    <el-button type="primary">导出</el-button>
                </el-form-item>                                                                             
            </el-form>
            <el-table
            :data="logList"
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
                label="操作时间"
                prop="createTime"
                :formatter="formatTime"
                >
                </el-table-column>                                
            </el-table>
        </div>
    </el-card>
</template>
<script>
import SelectTree from "./SelectTree";
export default {
    data(){
        return {
            searchForm:{
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            },
            pageNum:1,
            pageSize:10,
            logList:[],
            organList:[],
            valueId:0,
            isAccordion:true,
            props:{
                value:'id',
                label:'organName',
                children:'childrenList'
            },

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

        },
    methods:{
        deviceSelect(){

        },
        CheckChange(){

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
        positionFormat(row){
            let val = row.position
            let varr = val.split(',')
            return varr[1]+'-'+varr[0]
        },        
        // 取值
        getValue(value) {
        this.valueId = value;
        this.searchForm.organId = value
        },  
        //查询
        search(){
            this.utils.getLogger(this,this.searchForm)
        }, 
        clear(){
            this.utils.getLogger(this,{
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            })
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
        width: 97vw;
        height: 78vh;
        background: #06253d;
        border-radius: 5px;
        margin: 20px auto;
    } 
     /* form样式 */
     form.el-form.el-form--label-right.el-form--inline{
         margin-top: 20px;
     }
     .el-input,.el-select{
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
    .el-select /deep/ .el-input__inner {
        background-color: transparent;
        height: 30px;
    } 
    .choose-btn{
        width:150px;
    }       
</style>