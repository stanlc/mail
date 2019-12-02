<template>
    <div class="box">
        <div class="datebox">
            <span>{{today}}</span>
            <div class="selectbox">
                <select v-model="date" @change="selectDate">
                    <option value="0" selected disabled style="display: none;">日</option>
                    <option v-for="item in day" :key="item.index" :label="item" :value="item"></option>
                </select>
                <select v-model="month" @change="selectFn($event)">
                    <option value="0" selected disabled style="display: none;">月</option>
                    <option v-for="index of 12" :key="index" :label="index" :value="index"></option>
                </select>                
            </div>
        </div>
        <div id="log" style="width: 95%;height:190%;"></div>
    </div>
</template>index
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
            day:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            selectDay:'',
            myChart:{},
            option:{},
        }
    },
    computed:{
        today(){
            let date = new Date() 
            this.year = date.getFullYear()
            this.month = date.getMonth()+1
            this.date = date.getDate()
            let Y = date.getFullYear() + '年'
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月'
            let D = date.getDate() + '日'
            return Y+M+D
        }, 
    },
    created(){
        
    },
    watch: {
        valueList: {
        handler(newVal, oldVal) {
            if (this.chart) {
            if (newVal) {
                this.chart.setOption(newVal,true);
            } else {
                this.chart.setOption(oldVal);
            }
            } else {
                this.draw();
            }
            }
        }
    },
    mounted(){
        this.getValue();   //获取设备数据
        this.draw();
    },
    methods:{
        selectFn(){
            this.date = 0
            let d = new Date(this.year,this.month,0)
            let days = d.getDate()
            let arr = []
            arr = [...Array(days).keys()]
            this.day = arr.map(item=>item+1)
        },

        getValue(){
            this.timeList =[]
            this.valueList = [0]
            this.$http.get(`/index/timeInfo/?dataTime=${this.selectDay}`).then(res=>{
                this.list = res.data.data
                
                this.list.map((item,a)=>{
                    let that = this
                    this.timeList.push(item.hour)
                    this.valueList.push([item.hour,item.openNum,that.today])
                })
            })
            let fn = ()=>{this.myChart.setOption(this.option,true)}
            setTimeout(fn,200)
        },
        selectDate(){
            let temp = this.selectDay
            this.selectDay = this.year+'-'+this.month+'-'+this.date
            this.selectDay = this.selectDay.toString()
            let fn = ()=>{this.getValue()}
            setTimeout(fn,200)
        },
        draw(){
            let that = this
            this.myChart = this.$echarts.init(document.getElementById('log'))
            let myLog = this.myChart
            this.option={
                tooltip:{
                    show:true,
                    formatter: function (params) {

                        return '<p>'+(params.value[2]?params.value[2]:'')+'</p>'+'<p>'+(params.value[0]?params.value[0]:'')+'</p>'+'<p>'+(params.value[1]?params.value[1]:0)+'次'+'</p>'
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
                    name:'(次)',
                    nameGap:5,
                    nameTextStyle:{
                        color:'#fff',
                        align:'right',
                    },
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
            this.myChart.setOption(this.option)
            window.addEventListener("resize",function(){   
                        myLog.resize();
                    });
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
     top: 14%;
     left: 8%;
     z-index: 5;
  }
  .datebox span{
      position: absolute;
      top: 15%;
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
  #log{
      position: relative;
      top:10px;
      left:5%;
  }
  .selectbox{
      float: right;
       
  }
.box{
      width:100%;
  }
</style>