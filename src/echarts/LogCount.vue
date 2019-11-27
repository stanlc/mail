<template>
    <div>
        <div class="datebox">
            {{today}}
            <div class="selectbox">
                <select v-model="date" >
                    <option value="0" selected disabled style="display: none;">日</option>
                    <option v-for="item in day" :key="item.index" :label="item.value" :value="item.value"></option>
                </select>
                <select v-model="month" @change="selectFn($event)">
                    <option value="0" selected disabled style="display: none;">月</option>
                    <option v-for="index of 12" :key="index" :label="index" :value="index"></option>
                </select>                
            </div>

        </div>
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
            year:0,
            month:0,
            date:0,
            day:[],
        }
    },
    computed:{
        today(){
            let date = new Date() 
            this.year = date.getFullYear
            let Y = date.getFullYear() + '年'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月'
            let D = date.getDate() + '日'
            return Y+M+D
        }, 
    },
    created(){
        
    },
    mounted(){
        this.getValue();   //获取设备数据
        //this.draw();
    },
    methods:{
        selectFn(){
            this.date = 0
            let days = new Date(this.year,this.month,0)
            let arr = []
            arr = [...Array(days).keys()]
            this.day = arr.shift()
        },
        getValue(){
            this.$http.get('/index/timeInfo/').then(res=>{
                this.list = res.data.data
                this.list.map(item=>{
                    this.timeList.push(item.hour)
                    this.valueList.push(item.openNum)
                })
                console.log(this.valueList)
                this.draw()
            })
            
        },
        draw(){
            let that = this
            let myChart = this.$echarts.init(document.getElementById('log'))
            let option={
                tooltip:{
                    show:true,
                    formatter: function (params) {
                        return '<p>'+params.name+'</p>'+'<p>'+params.value+'次'+'</p>'
                    },
                },
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
                    data: this.valueList,
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
  .datebox{
      width: 75%;
     color: #00ffff; 
     font-size: 10px;
     position: absolute;
     top: 12%;
     left: 8%;
     z-index: 5;
  }
  .datebox select{
      width: 35px;
      height: 18px;
      border: none;
      background: #014043;
      border-radius: 5px;
      color: #00ffff; 
      margin-left:8px;
  }
  .selectbox{
      float: right;
  }
</style>