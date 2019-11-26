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
<style scoped>
  .home{
    overflow: hidden;
    height: 100vh;
    background: url(..\assets\img\bc.png);
    background-size: 100%;
  }
  .home /deep/ .el-card{
    border: none
  }
  .home /deep/ .el-menu{
    border: none
  }
  .home /deep/ .box-card{
    background: rgba(11,53,115,0.2);
  }
        /* dialog样式 */
  .home /deep/ .box-card /deep/ .el-dialog__header{
      background: #19437e;
      padding:10px;
  }
  .home /deep/ .box-card /deep/ .el-dialog__title{
      color: #fff;
  }
    .home /deep/ .box-card /deep/ .el-dialog__body{
        background: #143666;
        color: #fff;
    }
    .home /deep/ .box-card /deep/ .el-dialog__footer{
        background: #143666;
    } 
    /* .home /deep/ .el-dialog__body .el-form{
      text-align: center;
    }  */
    .home /deep/ .el-form /deep/ .el-input__inner{
      color: #fff
    } 
    
 
</style>