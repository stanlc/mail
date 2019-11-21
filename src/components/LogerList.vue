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
                    <div v-for="item in groupInfoList" :key="item.index" class="groupItem">
                        <span class="boxName">{{item.positionDetail|boxposition}}</span>
                        <p :class="item.openStatus===1?'green':'red'">{{item.openStatus|openStat}}</p>
                    </div>
                </div>
            </div>
            <div class="center"><el-button type="primary" @click="checkInfoVisible=false">返回</el-button></div>
            </el-dialog>            
            <!-- 位置dialog结束 -->
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
            deviceInfo:{},
            groupInfoList:[
                {
                    'positionDetail':'101',
                    'openStatus':1
                },
                {
                    'positionDetail':'102',
                    'openStatus':0
                },
                {
                    'positionDetail':'103',
                    'openStatus':0
                },
                {
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },
                {
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },{
                    'positionDetail':'102',
                    'openStatus':0
                },
            ],
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
            this.searchForm = {
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            } 
            this.$refs.selectTree.clearHandle()           
        }, 
        clear(){
            this.$refs.selectTree.clearHandle()//清空selectTree选项
            this.searchForm = {
                'pageNum':this.pageNum,
                'pageSize':this.pageSize,
            }
            this.utils.getLogger(this,this.searchForm)
        },
        //查看位置
        checkInfo(e){
            this.checkInfoVisible =true
            this.utils.getDeviceGroup(this,e.deviceNum)
            
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