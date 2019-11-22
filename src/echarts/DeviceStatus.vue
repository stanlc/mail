<template>
    <div>
        <div id="main" style="width: 400px;height:100px;"></div>
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
            let myChart = this.$echarts.init(document.getElementById('main'))
                var data = [
                {
                    name: '正常',
                    value: 10
                },{
                    name: '在线',
                    value: 44
                },{
                    name: '故障',
                    value: 35
                },{
                    name: '离线',
                    value: 30
                }]
                var titleArr= [], seriesArr=[];
                var colors=[['#35ddf0','#176273' ],['#ff8c37', '#ffdcc3'],['#ffc257', '#ffedcc'], ['#fd6f97', '#fed4e0'],['#a181fc', '#e3d9fe']]
                data.forEach(function(item, index){
                    titleArr.push(
                        {
                            text:item.name,
                            left: index * 20 + 8.5 +'%',
                            top: '76%',
                            textAlign: 'center',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: '12',
                                color: colors[index][0],
                                textAlign: 'center',
                            },
                        }        
                    );
                    seriesArr.push(
                        {
                            name: item.name,
                            type: 'pie',
                            clockWise: false,
                            radius: [20, 25],
                            itemStyle:  {
                                normal: {
                                    color: colors[index][0],
                                    shadowColor: colors[index][0],
                                    shadowBlur: 0,
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                }
                            },
                            hoverAnimation: false,
                            center: [index * 20 + 10 +'%', '50%'],
                            data: [{
                                value: item.value,
                                name:item.value,
                                label: {
                                    formatter: function(params){
                                        return params.value;
                                    },
                                    normal: {
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '14',
                                            color: '#fff'
                                        }
                                    }
                                },
                            }, {
                                value: that.count-item.value,  
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: colors[index][1]
                                    },
                                    emphasis: {
                                        color: colors[index][1]
                                    }
                                }
                            }]
                        }    
                    )
                });
            
                
            let option = {
                title:titleArr,
                series: seriesArr
            }
            myChart.setOption(option)
        }
    }
}
</script>
<style scoped>

</style>