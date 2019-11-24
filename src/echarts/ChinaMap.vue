<template>
    <div>
        <div id="map" style="width:600px;height:500px;"></div>
    </div>
</template>
<script>

import "echarts/map/js/china.js"
import "echarts-gl" //3D地图插件
export default {
    data(){
        return {
            count :100,
            normal:0,
            
        }
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
    
        draw(){
            let myChart = this.$echarts.init(document.getElementById('map'))
         
 
            let option = {
               
               geo3D:{
                   map:'china',
                   roam:true,
                   shading:'lambert',
                   itemStyle:{
                       color:'#081b41',
                       areaColor:'#081b41',
                       borderWidth:0.5,
                       borderColor:'#00ffff'
                   },
                    light: { //光照阴影
                        main: {
                            color: '#fff', //光照颜色
                            intensity: 1.2, //光照强度
                            shadowQuality: 'high', //阴影亮度
                            shadow: true, //是否显示阴影
                            alpha: 55,
                            beta: 10

                        },
                        ambient: {
                            intensity: 1
                        },
                        
                    },
               }
            }
            myChart.setOption(option)
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
</style>