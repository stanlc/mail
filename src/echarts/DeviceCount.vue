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
        getValue(){
            let that = this 
            this.$http.post('/device/pagerList',{}).then(res=>{
                this.count = res.data.paging.list.length
                let list = res.data.paging.list
                list.forEach(e => {
                    if(e.status===1){
                        that.normal++
                    }
                });
            })
        },
        draw(){
            let that = this
            let myChart = this.$echarts.init(document.getElementById('count'))
            myChart.setOption({
                    title:{
                        text:'1000',
                        top:'50%',
                        left:'40%',
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
                        radius: [20,35],
                        data:[
                            {value:235, name:'花园小区',itemStyle:{normal:{color:'#00ffff'}}},
                            {value:274, name:'楼山小区',itemStyle:{normal:{color:'#d5d147'}}},
                            {value:310, name:'东阳小区',itemStyle:{normal:{color:'#25c05f'}}},
                            {value:335, name:'其他',itemStyle:{normal:{color:'#1e82ef'}}},
                            {value:400, name:'南风小区',itemStyle:{normal:{color:'#d55521'}}},
                        ]
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