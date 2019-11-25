<template>
    <el-row :gutter="20" >
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <div class="status">
                    <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/run/info')"></el-button>
                    <device-status class="cav"></device-status>
                </div>
                <div class="count">
                    <div class="dcount">
                      <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/device/manager')"></el-button>
                      <device-count></device-count>
                    </div>
                </div>
                <div class="monitor">
                  <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/loger/list')"></el-button>
                  <log-count></log-count>
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content bg-purple-light">
                <div class="map">
                  <china-map></china-map>
                  <!-- <div class="groupbox">
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
                  </div> -->
                </div>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">
            <el-table
            :data="deviceList"
            style="width: 100%"
            >
                <el-table-column
                label="设备ID"
                prop="deviceId"
                width="200"
                >
                </el-table-column>
                <el-table-column
                label="位置"
                prop="devicePosition"
                >
                </el-table-column>                 
                <el-table-column
                label="运作状态"
                prop="status"
                :formatter="(row)=>{return row.status===1?'开':'关'}"
                >
                </el-table-column>
                <el-table-column
                label="操作"
                fixed="right"
                >
                    <template class="btn-box" slot-scope="scope">
                        <el-button type="primary" size="mini" @click="checkInfo(scope.row)">查看</el-button>                     
                    </template>                
                </el-table-column>                                                 
            </el-table>
          </div></el-col>
    </el-row>
</template>

<script>
import deviceStatus from '../echarts/DeviceStatus'
import deviceCount from '../echarts/DeviceCount'
import LogCount from '../echarts/LogCount'
import ChinaMap from '../echarts/ChinaMap'

export default {
  data(){return{
    totalNum:1000,
    deviceList:[],
    deviceInfo:[],
  }},
  components:{
    deviceStatus,
    deviceCount,
    ChinaMap,
    LogCount,
  },
  mounted(){
    this.$http.post('/device/pagerList',{}).then(res=>{
      this.deviceList = res.data.paging.list
    })
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
  methods:{
    //查看位置
        checkInfo(e){
            this.utils.getDeviceGroup(this,e.deviceNum)
            console.log(this.deviceInfo)
        },
  }
}
</script>
<style lang="scss" scoped>
  .el-row {
    padding:40px 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    
  }
  .bg-purple{
    margin-top: -10px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  
  
  .grid-content {
    border-radius: 4px;
    height: 74vh;
    
  }
  .status{
    background: url(..\assets\img\deviceStatus.png) no-repeat;
    background-size:contain;
    width: 20vw;
    height: 10vw; 
    display:flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-top: 5px;
  }
  .status .cav{
    margin-left: 70px;
  }
  .count{
    background: url(..\assets\img\deviceCount.png) no-repeat;
    background-size:100%;
    width: 20vw;
    height: 14vw;
    display:flex;
    justify-content: center;
    align-items: center; 
    position: relative; 
    margin-top: 10px;
  }
  
  .monitor{
    background: url(..\assets\img\logCount.png) no-repeat;
    background-size:100%;
    width: 20vw;
    height: 13vw; 
    display:flex;
    justify-content: center;
    align-items: center; 
    position: relative; 
    margin-top: 10px;
  }  
  
  .more{
    position: absolute;
    top:10px;
    right:15px;
    font-size: 18px;
    color: #00ffff;
    z-index: 2;
  }
  .map{
    position: relative;
  }
  .groupbox{
    position: absolute;
    top:0;
    left:10px;
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