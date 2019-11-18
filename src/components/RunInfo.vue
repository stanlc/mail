<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>运行监测</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="小区名称：">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item>
                <el-form-item label="楼栋：">
                    <el-input v-model="searchForm.building"></el-input>
                </el-form-item> 
                <el-form-item label="运行状态：">
                    <el-select v-model="searchForm.state">
                        <el-option label="在线" value="在线"></el-option>
                        <el-option label="离线" value="离线"></el-option>
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
                prop="id"
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
                :formatter="formatTime"
                >
                </el-table-column>
                <el-table-column
                label="单日操作次数"
                prop="logtime"
                :formatter="formatTime"
                >
                </el-table-column>     
                <el-table-column
                label="操作时间"
                prop="time"
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
                'name':'',
                'building':'',
                'status':'',
                'id':''
            },
            runInfoList:[],

        }
    },
    methods:{
        deviceSelect(){

        },
        CheckChange(){

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