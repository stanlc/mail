<template>
  <div class="home">
        <Header></header>
        <nav-menu :menuList="menuList"></nav-menu>
        <router-view :menuList="menuList"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import NavMenu from '@/components/NavMenu.vue'

export default {
  name: 'home',
  components: {
    Header,
    NavMenu,
  },
  data(){
    return{
      menuList:[]
    }
  },
  created(){
      this.menuList = JSON.parse(localStorage.menuList) 
  },
  
  methods:{
    
  },
}
</script>
<style lang='scss'>
    
    //Table样式
body .el-table th.gutter{
  display: table-cell!important;  //浏览器缩放表头出现白边
}

.el-table {
  background: transparent !important; //表格背景色
  tr th{
    background: transparent !important;    //表头背景色
    border: none !important;  //表头下边框
    text-align: center;
    
  }
  thead tr{
    background: transparent
  }
  tbody tr{
    &:nth-child(odd){
      background: rgba(14,59,128,0.3);    
    }
   
    &:nth-child(even){
      background: transparent;
    }
    td{
      border: none;
      text-align: center;
      color: #fff;
    }
  }
}  
.el-table::before{
  height: 0px !important;   //表格下边框
}

.el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: #212e3e !important;    //hover项背景颜色
}

  .el-table  thead{
      color: #15d3da !important;
      
  }

@import '../assets/common.css'
</style>