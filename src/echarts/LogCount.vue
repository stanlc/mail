<template>
    <div>
        <div id="log" style="width: 300px;height:200px;"></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            
            
        }
    },
    computed:{
      
    },
    created(){
        
    },
    mounted(){
        //this.getValue();   //获取设备数据
        this.draw();
    },
    methods:{
        draw(){
            let that = this
            let myChart = this.$echarts.init(document.getElementById('log'))
            let option={
            
                xAxis: {
                    type:"category",
                    data:['4:00','8：00','12:00','16:00','20:00'],
                    axisLabel: {
                       color:'#fff'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#00ffff'
                        }
                    },
                    axisTick:{
                        inside:true,
                    
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                       color:'#fff'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#00ffff'
                        }
                    },
                    axisTick:{
                        inside:true,
                    
                    },
                    splitLine :{
                        lineStyle:{
                            type:'dashed',
                            color:'#00ffff'
                        }
                    }
                   
                },
                series: [{
                    data: [200, 700, 400, 500,600,300],
                    type: 'line',
                    
                    itemStyle:{
                        normal:{
                            color:'#00ffff'
                        }
                    }
                }]

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