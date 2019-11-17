<template>
    <div>
       <el-card header="信报箱管理平台" class="logincard" >
           <el-form @submit.native.prevent="checkin">
               <el-form-item label="用户名">
                   <el-input v-model="loginform.userName"></el-input>
               </el-form-item>
               <el-form-item label="密码">
                   <el-input type="password" v-model="loginform.password"></el-input>
               </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">登录</el-button>
                </el-form-item>
           </el-form>
       </el-card>
    </div>
</template>
<script>

export default {

    data(){
        return {
            loginform:{
                'userName':'',
                'password':''
            },
        }
    },
    methods:{
        async login(){
            const res = await this.$http.post('/user/login',this.loginform)
            localStorage.token = res.headers['x-user-token']
            localStorage.userInfo = JSON.stringify(res.data.data)
            this.$message({
                type:'success',
                message:'登录成功'
            })
        },
        checkin(){
            this.login().then(()=>{
                this.utils.getMenu(this)
                
            })
        }
    },
}
</script>
<style scoped>
    .logincard{
        width: 20rem;
        margin: 5em auto;
       
    }
</style>