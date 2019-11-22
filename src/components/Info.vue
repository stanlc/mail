<template>
    <el-row :gutter="30" >
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <div class="status">
                    <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/run/info')"></el-button>
                    <device-status class="cav"></device-status>
                </div>
                <div class="count">
                    <device-count></device-count>
                </div>
                <div class="monitor"></div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content bg-purple-light">
                <span>222</span>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">3</div></el-col>
    </el-row>
</template>

<script>
import deviceStatus from '../echarts/DeviceStatus'
import deviceCount from '../echarts/DeviceCount'

export default {
  data(){return{
    totalNum:1000,
  }},
  components:{
    deviceStatus,
    deviceCount,
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
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
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
    background-size:100%;
    width: 24vw;
    height: 12vw; 
    display:flex;
    justify-content: center;
    align-items: center;
    margin-left: -6px;
    margin-bottom:10px; 
    position: relative;
    padding-top: 5px;
  }
  .status .cav{
    margin-left: 60px;
  }
  .count{
    background: url(..\assets\img\deviceCount.png) no-repeat;
    background-size:100%;
    width: 24vw;
    height: 16vw; 
    display:flex;
    justify-content: center;
    align-items: center; 
    margin-left: -6px;  
    position: relative; 
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