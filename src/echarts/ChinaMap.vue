<template>
    <div>
        <div class="mapbox">
            <div id="map" style="width:650px;height:500px;"></div>
        </div>
        <div id="message" v-show="showmes">
            <a class="close" @click="showmes=false">X</a>
            <span style="color:#0bb6cf;display:block;">设备定位</span><br>
            <span>联系人：{{deviceGroup.organPerson}} {{deviceGroup.phone}}</span><br>
            <span>位置：{{deviceGroup.position}}{{deviceGroup.positionDetail}}</span><br>
            <span>状态：开启{{deviceGroup.openStatusNum}}/关闭{{deviceGroup.offStatusNum}}</span><br> 
            <a href="javascript:;" @click="groupShow=!groupShow">>组状态查看</a>
            <div v-if="groupShow" class="group">
                <span style="color:#0bb6cf;display:block;"> 组状态</span><br>
                <span >{{deviceGroup.position}}-{{deviceGroup.positionDetail}}</span>
                <span >{{deviceGroup.organPerson}} {{deviceGroup.phone}}</span><br>
                <div class="groupBox center">
                    <div v-for="item in deviceGroup.groupInfoList" :key="item.index" class="groupItem">
                        <span class="boxName">{{item.positionDetail|boxposition}}</span>
                        <p :class="item.openStatus===1?'green':'red'">{{item.openStatus|openStat}}</p>
                    </div>
                </div>                
            </div>
        </div>
        <div class="table">
            <div class="tablebox">
                <el-table
                :data='deviceList'
                style="width: 100%">
                    <el-table-column
                    type="index">
                    </el-table-column>
                    <el-table-column
                    label="设备ID"
                    prop="deviceId"
                    >
                    </el-table-column>
                    <el-table-column
                    label="位置"
                    prop="devicePosition"
                    >
                    </el-table-column>                 
                    <el-table-column
                    label="状态"
                    prop="status"
                    :formatter="statFormat"
                    >
                    </el-table-column>                     
                    <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="show(scope.row)" type="primary" size="mini">定位</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </div>
        
        </div>
        
    </div>
</template>
<script>

import "echarts/map/js/china.js"
import GroupInfo from '../components/GroupInfo'
import "echarts-gl" //3D地图插件
export default {
    data(){
        return {
            count :100,
            normal:0,
            myChart:'',
            boxx:0,
            boxy:0,
            colors:'',
            showmes:false,
            deviceList:[],
            geoDeviceList:[],
            deviceGroup:{
            },
            option:{},
            groupShow:false,
        }
    },
    components:{
        GroupInfo,
    },
    computed:{
        rest(){
            return (this.count-this.normal===0)?null:(this.count-this.normal)
        }
    },
    created(){
        
    },
    mounted(){
        this.utils.getDeviceList(this,{});   //获取设备数据
        this.draw();
       
        
    },
    filters:{
        openStat(e){
            if(e===1){
                return '开启'
            }else if(e===0){
                return '关闭'
            }else{
                return '无状态'
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
        show(row){
            this.$http.post(`/device/deviceGroup/${row.deviceNum}`).then(res=>{
                this.deviceGroup = res.data.data
                //显示弹出框
                let cc = ((this.deviceGroup.openStatus)===1)?'#9bbc42':'#a32d50'
                let tude = [parseFloat(this.deviceGroup.organLatitude),parseFloat(this.deviceGroup.organLongitude),cc]
                //地图标点
                this.geoDeviceList.push(tude)  //待去重
                let c = this.myChart.convertToPixel('geo', tude);   //把经纬度转为坐标
                let a = document.getElementById('message')
                if(row.status===1){
                    this.colors = '#a32d50'
                }else{
                    this.colors = '#9bbc42'
                }
                a.style.top =c[0]-168+'px'                
                a.style.left=c[1]-187+'px'
                this.showmes = true
                this.myChart.setOption(this.option)
            })
        },
        openInfo(){
            
            let a = document.getElementById('message')
            a.style.top =this.boxy+'px'
            a.style.left=this.boxx+'px'
            this.showmes = !this.showmes
            
        },
        statFormat(row){
                if(row.status===1){
                    return '开启'
                }else if(row.status===0){
                    return '关闭'
                }else{
                    return '无状态'
                }
        },
        draw(){
            this.myChart = this.$echarts.init(document.getElementById('map'))
            this.option = {
        
            geo: [
                {
                    map:'china',
                    
                            regions: [
                        {
                        name: "南海诸岛",
                        value: 0,
                        itemStyle: {
                            normal: {
                            opacity: 0,
                            label: {
                                show: false
                            }
                            }
                        }
                        },
                    ],
                    roam:false,        //禁止拖拽
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor:'#04b2ac',
                            borderWidth:0.8,
                            areaColor: '#081b41',
        
                        },
                        emphasis: {
                            borderWidth:1,
                            areaColor: '#081b41',
                            borderColor:'#013a67'
                        }
                    }
                }
        
            ],


                    series:[
                        {
                            
                            name:'标签',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: function (params){
                            　　　　　　　　return params.value[2]

                            　　　　　　}
                                }
                            },
                            data:this.geoDeviceList
                        },
                        
                    ]
                    }
                    this.myChart.setOption(this.option)
                     let that = this
                        // this.myChart.on('click',function(params){
                        //     that.boxx= params.event.event.layerX  -143       //获取点击位置
                        //     that.boxy = params.event.event.layerY-170
                        //     console.log(params)
                        //     if(params.data.name){
                        //         that.openInfo() 
                                
                        //     }
                            
                        // });
                    }
            }
}
</script>
<style scoped>
  .total{
    position: absolute;
    top: 30px;
    left: 40px;
    color: #fff;
    font-size: 12px;
  }
  .total b{
    color: #00ffff;
    font-size: 16px;
    font-weight: normal;
    margin-right: 4px;
  }
  .mapbox{
    background: url(..\assets\img\mapbox.png) no-repeat;
    background-size:contain;
    width: 43vw;
    height: 40vw;
    margin-top: -10px;
    display: inline-block;
    text-align: center;
  }
  .table{
    background: url(..\assets\img\list.png) no-repeat;
    background-size:100% 100%;   
    width: 26vw;
    height: 40vw;   
    margin-top: -10px;
    padding: 0 15px;
  }
  .table .el-table{
      margin: 25px auto;
  }
  .tablebox{
      overflow-y: auto;
  }
 #map{
     position: relative;
     top: 10%;
     left: -6%;
 }
 #message span,#message a{
     color: #fff;
 }
#message{
    background: url(../assets/img/position.png) no-repeat;
    background-size: contain;
    width: 300px;
    height: 160px;
    display: block; 
    padding: 15px;
    position: absolute;
}
.table{
    position: absolute;
    top:0;
    left: 42.5vw;
}
    /* 组状态样式 */
    .group{
        margin-top:60px;
    }
    .boxName{
        display: block;
        width: 100%;
        height: 20px;
        text-align: center;
        padding: 2px;
        line-height: 20px;
        background: #09aec2;
        border-radius: 5px;
        font-size: 10px; 
    }  
    .group{
        
        background: url(../assets/img/group.png) no-repeat;
        background-size: contain;
        padding: 15px;
    }
    .groupBox{
        display: block;
        width: 95%;
        height: 100%;
        overflow-y: scroll;
        margin-bottom: 40px;
        margin-top: 5px;
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
    .close{
        position: absolute;
        right: 10px;
        top: 10px;
        
    }
    .close:hover{
        cursor:pointer
    }
</style>