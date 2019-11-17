<template>
    <div class = "nav-head">
        <el-menu 
          class="el-menu-demo" 
          mode="horizontal" 
          background-color = "#1c4072"
          :default-active="$route.path"
          text-color="#fff"
          router
          >
          <el-menu-item v-for="item in menuList" :key="item.index" :index="item.sourcePath" >{{item.resourceName}}</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
  data(){
    return{
     
    }
  },
  props:{
    menuList:'',
    
  },
}
</script>
<style scoped lang="scss">
  .nav-head{
    opacity: 0.8;
    .el-menu.el-menu--horizontal {
      border-bottom: none;
    }
    .el-menu--horizontal>.el-menu-item{
      border:none;            //去除导航单个选项边框
    }
  }
  .el-menu-demo .el-menu-item{
    text-align: center;
    width:10vw;
  }
  .el-menu-demo ul li{
    height: 3vw;
    line-height: 30px;
  }
  .el-menu-demo .el-menu-item:hover{
    outline: 0 !important;
    background-color: #22bdd8 !important;
    color:#fff !important;
  }
  .el-menu-item.is-active {
    border: 0 !important;
    color: #fff !important;
    background-color: #22bdd8 !important;
  }

</style>