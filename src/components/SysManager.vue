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
        this.subList = this.utils.subList(this,6).childrenList
    },
    props:{
        menuList:''
    },
   
}
</script>
<style scoped>

    .el-menu{
        text-align: center;
        height: 84vh;
        border:none; 
    }
        .el-menu-item{
    text-align: center;
  }
</style>