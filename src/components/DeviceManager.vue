<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>设备管理</span>
        </div>
        <div>
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="设备类型：">
                    <el-input v-model="searchForm.type"></el-input>
                </el-form-item>
                <el-form-item label="设备名称：">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item> 
                <el-form-item label="设备状态：">
                    <el-select v-model="searchForm.state">
                        <el-option label="在线" value="在线"></el-option>
                        <el-option label="离线" value="离线"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅账号：">
                    <el-input v-model="searchForm.account"></el-input>
                </el-form-item>  
                <el-form-item label="所属机构：">
                    <el-select v-model="searchForm.state">
                        <el-option label="小区1" value="小区1"></el-option>
                        <el-option label="小区2" value="小区2"></el-option>
                    </el-select>
                </el-form-item>                 
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>                                                                           
            </el-form>
            <el-form>
                <el-button type="primary">配置机构</el-button>
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
                label="设备名称"
                prop="name"
                >
                </el-table-column>                
                <el-table-column
                label="设备状态"
                prop="status"
                >               
                </el-table-column>
                <el-table-column
                label="序列MAC"
                prop="mac"
                >
                </el-table-column>                 
                <el-table-column
                label="订阅账号"
                prop="account"
                >
                </el-table-column>
                <el-table-column
                label="所属机构"
                prop="organName"
                >
                </el-table-column>     
                <el-table-column
                label="操作"
                fixed="right"
                >
                    <template>
                        <el-button type="info" size="small">详情</el-button>
                        <el-button type="primary" size="mini">编辑</el-button>
                    </template>                
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
            runInfoList:[
                {
                    'name':'aa',
                    'organName':'bb'
                }
            ],

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