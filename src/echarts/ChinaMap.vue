<template>
    <div>
        <div id="map" style="width:600px;height:500px;"></div>
        <el-button @click="show">aaa</el-button>
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
        //this.getValue();   //获取设备数据
        this.draw();
    },
    methods:{
    show(){
        this.myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: 0,
                position:['30%','2%']
            })
    },
        draw(){
            this.myChart = this.$echarts.init(document.getElementById('map'))
         
  

    let option = {
    
    tooltip:[
        {trigger: 'item',
            formatter(params){
            return `aa`
            }
        },
       
    ],

    

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
                    data:[
                        {
                            name:'111',
                            value:[119.0918, 36.524,1]
                        },{
                            name:'222',
                            value:[84.77,45.59,0]
                        }
                    ]
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
  .box{
      background:#fff;
  }
</style>