<template>
    <el-row :gutter="20" >
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <div class="status">
                    <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/run/info')"></el-button>
                    <device-status class="cav"></device-status>
                </div>
                <div class="count">
                      <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/device/manager')"></el-button>
                      <device-count></device-count>
                </div>
                <div class="monitor">
                  <el-button type="text" icon="el-icon-more" class="more" @click="$router.push('/loger/list')"></el-button>
                  <log-count class="logecharts"></log-count>
                </div>
            </div>
        </el-col>
        <el-col :span="18">
            <div class="grid-content bg-purple-light">
                <div class="map">
                  <china-map></china-map>
                </div>
            </div>
        </el-col>
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
    margin-top: -0.5%;
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
    display: -moz-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -moz-box-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -moz-box-pack: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    /*for ie9*/
    justify-content: center;
    position: relative;
    padding-top: 5px;
  }
  // .status .cav{
  //   margin-left: 60px;
  //   width:100%;
  // }
  @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        .status .cav{
            margin: 0 10%;
          }
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
    margin-top: 25px;
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
    margin-top: 25px;
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