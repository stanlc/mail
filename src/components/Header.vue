<template>
  <div class="headContainer">
          <div class="left clearfix">
            <!-- <div class="logo"></div>
            <div class="title">信报箱监测平台</div> -->
            <p><img class="middle" src="..\assets\img\logo.png"/>信报箱监测平台</p>
          </div>
          <div class="right clearfix">
            <div class="user">
                <div class="vip float">
                  vip<span>|</span>
                </div>
                <div class="float">
                  <el-avatar :size="20" icon="el-icon-user-solid"></el-avatar>
                </div>
                <div class="float">{{userName}}</div>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>修改密码</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <a href="javascript:;" class="el-icon-d-arrow-right" @click="checkout">退出</a>
            </div>
          </div>
    </div>
</template>

<script>
export default {
   data(){
    return{
      userName:'',
    }
  },
  created(){
    this.userName = JSON.parse(localStorage.userInfo).userName
  },
  methods:{
    checkout(){
      localStorage.clear()
      this.$router.push('/login')
    }
  },
}
</script>
<style scoped lang="scss">
  .float{
  float: left;
  }
  .clearfix::after{
    content: '';
    display: block;
    height: 0;
    clear: both;
  }
  a{
    color: #fff;
    text-decoration: none;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .headContainer{
      width: 100%;
      height: 60px;
      background-color: transparent;
      color: #fff;
      text-align: center;
      .right{
        float: right;
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 20px;
        .user div{
          margin:0 10px 0 0;
          span{
            margin:0 0 0 10px;
          }
          .checkout{
            margin:0 10px 0 0;
          }
        }
      }
      .left{
          float: left;
          height: 100%;
          font-size: 30px;
          color:#00ffdd;
          font-weight:bold;
          display: flex;
          align-items: center;
          
          margin-left: 40px; 
        }
    }
    .middle{
      vertical-align: middle;
      margin-right:18px;
    }
</style>