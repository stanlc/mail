<template>
    <div>
        <span class="total"><b>{{count}}</b>总设备（台）</span>
        <div id="count" style="width: 400px;height:200px;"></div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            count :0,
            organList:[],
            countlist:[
            ],
            colors:['#00ffff','#d5d147','#25c05f','#1e83f2','#d55521']
        }
    },
    computed:{
        rest(){
            return (this.count-this.normal===0)?null:(this.count-this.normal)
        }
    },
    created(){
        // this.utils.getOrganList(this)
        
    },
    mounted(){
           //获取设备数据
        this.getValue();
        
    },
    methods:{
        getValue(){
            let that = this 
            this.$http.get('/index/deviceInfo').then(res=>{
                this.count = res.data.data.deviceNum
               let list = res.data.data.childrenInfo
               list.map(item=>{
                   this.countlist.push({name:item.childOrganName,value:item.childDeviceNum,itemStyle:{normal:{color:''}},label:{normal:{formatter:function(params){
                                return params.name+'-'+((params.value/that.count)*100).toFixed(2)+'%'+' \n '+params.value+'(台)';
                            }}}})
               })
                this.countlist.map((item,index)=>{item.itemStyle.normal.color=that.colors[index]})
                console.log(this.countlist)
                this.draw()
            })
        },
        draw(){
            let that = this
            let myChart = this.$echarts.init(document.getElementById('count'))
            myChart.setOption({
                    title:{
                        text:that.count,
                        top:'45%',
                        left:'47.5%',
                        textStyle:{
                            fontWeight: 'normal',
                            fontSize: '14',
                            color: '#fff',
                            textAlign: 'center',
                        }
                    },
                    series : [
                    {
                        type: 'pie',
                        radius: [20,30],
                        data:that.countlist,
                        itemStyle:{normal:{
                            
                        }}
                    }
                ]
            })
        }
    }
}
</script>
<style scoped>
  .total{
    position: absolute;
    top: 25px;
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
  #count{
      margin-top: 15px;
  }
</style>