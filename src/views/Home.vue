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
  }
</style>