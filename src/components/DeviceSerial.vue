<template>
    <el-container>
        <el-aside width="15vw">
           <el-menu 
          class="el-menu-demo" 
          background-color = "#1c4072"
          :default-active="$route.path"
          text-color="#fff"
          router
          >
          <el-menu-item v-for="item in subList" :key="item.index" :index="item.sourcePath" ><div :class="item.iconCls"></div>{{item.resourceName}}</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>
<script>
export default {
    data(){
        return {
            subList:[]
        }
    },
    mounted(){
        this.subList = this.utils.subList(this,4).childrenList
    },
    props:{
        menuList:''
    },
   
}
</script>
<style scoped>
    .el-aside .el-menu{
        text-align: center;
        height: 100vh;
        
    }
    .box-card{
        background: rgba(11,53,115,0.2);
        border: none;
    }
    .el-menu{
        border:none;
    }
    .el-menu-item{
    text-align: center;
    width:100%;
  }
</style>