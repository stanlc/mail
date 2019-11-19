<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>操作日志</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="小区名称：">
                    <el-input v-model="searchForm.deviceName"></el-input>
                </el-form-item>
                <el-form-item label="楼栋：">
                    <el-input v-model="searchForm.devicePosition"></el-input>
                </el-form-item> 
                <el-form-item label="运行状态：">
                    <el-select v-model="searchForm.state">
                        <el-option label="在线" value=1></el-option>
                        <el-option label="离线" value=2></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备ID：">
                    <el-input v-model="searchForm.id"></el-input>
                </el-form-item>   
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="primary">重置</el-button>
                </el-form-item>  
                <el-form-item>
                    <el-button type="primary">导出</el-button>
                </el-form-item>                                                                             
            </el-form>
            <el-table
            :data="runInfoList"
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
                prop="deviceId"
                >
                </el-table-column>                
                <el-table-column
                label="小区名称"
                prop="organName"
                >               
                </el-table-column>
                <el-table-column
                label="所在楼栋"
                prop="devicePosition"
                >
                </el-table-column>                 
                <el-table-column
                label="设备名称"
                prop="deviceName"
                >
                </el-table-column>
                <el-table-column
                label="运作状态"
                prop="status"
                >
                </el-table-column>
                <el-table-column
                label="单日操作次数"
                prop="logtime"
                >
                </el-table-column>     
                <el-table-column
                label="操作时间"
                prop="updateTime"
                :formatter="formatTime"
                >
                </el-table-column>                                
            </el-table>
        </div>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            searchForm:{
                'pageNum':1,
                'pageSize':10
            },
            runInfoList:[],

        }
    },
    mounted(){
           if(localStorage.deviceList){
               this.runInfoList = JSON.parse(localStorage.deviceList)
           }
        },
    methods:{
        deviceSelect(){

        },
        CheckChange(){

        },
        formatTime(row){
            let val = row.updateTime
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