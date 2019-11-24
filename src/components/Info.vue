<template>
    <el-row :gutter="20" >
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <div class="status">
                    <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/run/info')"></el-button>
                    <device-status class="cav"></device-status>
                </div>
                <div class="count">
                    <device-count></device-count>
                </div>
                <div class="monitor">
                  <log-count></log-count>
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content bg-purple-light">
                <div class="map">
                  <china-map></china-map>
                </div>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple-light">3</div></el-col>
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
  }},
  components:{
    deviceStatus,
    deviceCount,
    ChinaMap,
    LogCount,
  },
  
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
  
  .bg-purple-light {
    background: #e5e9f2;
   
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
    top:22px;
    right:40px;
    font-size: 18px;
    color: #00ffff;
    z-index: 2;
  }
  
</style>