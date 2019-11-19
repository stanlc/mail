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
                    <el-input v-model="searchForm.deviceName"></el-input>
                </el-form-item> 
                <el-form-item label="设备状态：">
                    <el-select v-model="searchForm.status">
                        <el-option label="在线" value=1></el-option>
                        <el-option label="离线" value=0></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅账号：">
                    <el-input v-model="searchForm.deviceAccount"></el-input>
                </el-form-item>  
                <el-form-item label="所属机构：">
                        <el-input v-model="searchForm.organName"></el-input>
                </el-form-item>  
                <el-form-item label="所在位置：">
                        <el-input v-model="searchForm.devicePosition"></el-input>
                </el-form-item>                                                                                                       
            </el-form>
            <el-form>
                <el-form-item>      
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="clear">重置</el-button>
                </el-form-item>
            </el-form>
                         
            <el-form>
                <el-button type="primary" @click="configOrgan" :disabled="selectDevices.length!==1">配置机构</el-button>
                <el-button type="primary" @click="configPosition" :disabled="selectDevices.length!==1">配置位置</el-button>
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
            width="40%"
            :model="bindDeviceForm"
            class="bind"
            >
                <el-form label-position="right" label-width="auto">
                    <el-form-item label="设备账号：">
                        <el-select v-model="configDeviceForm.deviceAccount" @change="choseAccount" placeholder="请选择设备账号">
                            <el-option v-for="item in accountList" :key="item.index" :label="item.account" :value="item.account"></el-option>
                        </el-select>                                     
                    </el-form-item>
                    <el-form-item label="设备授权码：">
                        <el-input v-model="configDeviceForm.deviceSerial" ></el-input>
                    </el-form-item>
                    <el-form-item label="正品码：">
                        <el-input v-model="configDeviceForm.genuineCode" ></el-input>
                    </el-form-item>   
                </el-form>
                <el-form :inline="true">
                    <el-button type="primary" @click="configDevice">确定</el-button>
                    <el-button type="primary" @click="configDeviceDialogVisible =false">取消</el-button>
                </el-form>  
            </el-dialog>            
            <!-- 编辑设备dialog -->                              
            <el-table
            :data="deviceList"
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
                prop="deviceName"
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
                label="操作"
                fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button type="info" size="small" @click="openInfo(scope.row)">详情</el-button>
                        <el-button type="primary" size="mini" @click="openConfig(scope.row)">编辑</el-button>
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
                "pageNum": 1,
                "pageSize": 5
            },
            deviceList:[],
            InfoVisible:false,
            rowInfo:{},
            selectDevices:[],
            configDeviceForm:{},
            configDeviceDialogVisible:false,
        }
    },
    created(){
        this.utils.getDeviceList(this,this.searchForm)
    },
    methods:{
        deviceSelect(e){
            this.selectDevices = e
        },
        CheckChange(){

        },
        status(row){
            let s = row.status
            if(s===1){
                return '在线'
            }else{
                return '离线'
            }
        },
        //筛选
        search(){
            this.utils.getDeviceList(this,this.searchForm)
        },
        clear(){
            this.utils.getDeviceList(this,{'pageNum':1,'pageSize':5})
        },
        //详情
        openInfo(row){
            this.InfoVisible = true
            this.rowInfo = row
            
        },
        //编辑
        openConfig(row){
            this.configDeviceDialogVisible = true
        },
        //配置设备
        //配置机构
        configOrgan(){
            if(this.selectDevices.length>1){
                this.configBtn = false
            }
        },
        //配置位置
        configPosition(){

        },
        //设备编辑
        choseAccount(){

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
</style>