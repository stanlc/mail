<template>
    <div>
        <div id="map" style="width:600px;height:500px;"></div>
        <div id="message" v-show="showmes"></div>
        <div class="table">
            <el-table
            :data='deviceList'
            style="width: 100%">
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
                :formatter="(row)=>{return row.status===1?'开':'关'}"
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
            showmes:false,
            deviceList:[],
            deviceGroup:{},
            dotList:[
                                {
                                    name:'111',
                                    value:[119.0918, 36.524],
                                    num:111
                                },{
                                    name:'222',
                                    value:[84.77,45.59,0],
                                    num:222
                                }
                            ]
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
        let that = this
        this.myChart.on('click',function(params){
            that.boxx= params.event.event.layerX  -143       //获取点击位置
            that.boxy = params.event.event.layerY-170
            console.log(params)
            if(params.data.name){
                that.openInfo() 
                
            }
            
        });
        
    },
    methods:{
        show(row){
            this.$http.post(`/device/deviceGroup/${row.deviceNum}`).then(res=>{
                this.deviceGroup = res.data.data
                let tude = [parseFloat(this.deviceGroup.organLongitude),parseFloat(this.deviceGroup.organLatitude)]
                let c = this.myChart.convertToPixel('geo', tude);   //把经纬度转为坐标
                let a = document.getElementById('message')
                a.style.top =c[1]-170+'px'                
                a.style.left=c[0]-143+'px'
                this.showmes = true
            })
        },
        openInfo(){
            
            let a = document.getElementById('message')
            a.style.top =this.boxy+'px'
            a.style.left=this.boxx+'px'
            this.showmes = true
            
        },
        draw(){
            this.myChart = this.$echarts.init(document.getElementById('map'))
            let option = {
           
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
                    roam:true,
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
                                    color: function(params){
                                        if(params.state===1){
                                            return '#a4c63e'
                                        }else{
                                            return '#a32d50'
                                        }
                                    }
                                }
                            },
                            data:this.dotList
                        },
                        
                    ]
                    }
                    this.myChart.setOption(option)
                    
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
 #map{
     position: relative;
 }
#message{
    background: url(../assets/img/position.png) no-repeat;
    background-size: contain;
    width: 300px;
    height: 160px;
    display: block; 
    position: absolute;
}
.table{
    position: absolute;
    top:0;
    left: 47vw;
}

</style>