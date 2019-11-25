<template>
    <div>
        <div id="log" style="width: 300px;height:200px;"></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            list : [],
            timeList:[],
            valueList:[],
            
        }
    },
    computed:{
      
    },
    created(){
        
    },
    mounted(){
        this.getValue();   //获取设备数据
        this.draw();
    },
    methods:{
        getValue(){
            this.$http.get('/index/timeInfo/').then(res=>{
                this.list = res.data.data
                this.list.map(item=>{
                    this.timeList.push(item.hour)
                    this.valueList.push([item.hour,item.openNum])
                })
                console.log(this.valueList)
            })
            
        },
        draw(){
            let that = this
            let myChart = this.$echarts.init(document.getElementById('log'))
            let option={
            
                xAxis: {
                    type:'category',
                    boundaryGap: false,
                    
                    data:['0','4:00','8:00','12:00','16:00','20:00','24:00'],
                    axisLabel: {
                       color:'#fff',
                       interval:0,  //刻度间隔为0
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
                    data: [['0:00',1],['4:00',2]],
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