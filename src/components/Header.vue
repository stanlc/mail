<template>
  <div class="headContainer">
          <div class="left clearfix">
            <div class="logo"></div>
            <div>信报箱监测平台</div>
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
                <div class="el-icon-more"><span>|</span></div>
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
  .headContainer{
      width: 100%;
      height: 60px;
      background-color: #052746;
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
          .logo{
            width: 145px;
            height: 30px;
            background:#06dfe3;
            margin:0 10px 0 20px;
          }
        }
    }
</style>