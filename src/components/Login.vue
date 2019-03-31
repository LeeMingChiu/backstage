<template>
  <div @keyup.enter="login">
    <Card class="login">
      <div>
        <!--<img src="../assets/logo.png" alt="" style="width:100px; margin-bottom:20px">-->
        <p slot="title" style="color:#333;font-size:20px;margin-bottom:20px">PPTV-任务系统后台</p>
        
      </div>
      <div class="btn">
        <label for="username">用户名：</label>
        <Input id="username" style="width:200px;" v-model="username"/>
      </div>
      <div class="btn">
        <label for="password">密&nbsp;&nbsp;&nbsp;码：</label>
        <Input type="password" id="password" style="width:200px;" v-model="password"/>
      </div>

      <div>
        <Button class="login_btn" @click="login">登录</Button>
      </div>
      <div class="btn" style="text-align: right;padding-left:20px;">
        <router-link to="/register" style=";margin-right:25px;">去注册</router-link>
      </div>
    </Card>
  </div>
</template>

<script>
  import api from '../libs/API';
  export default {
    name: "Login",
    data(){
      return {
        username:'',
        password:''
      }
    },
    methods:{
      getToken() {
        return api.get('get_token')
      },
      login() {
        if(this.username===''){
          return this.$Message.warning({
            content: '用户名不能为空',
            duration: 3
          });
        }
        if(this.password===''){
          return this.$Message.warning({
            content: '密码不能为空',
            duration: 3
          });
        }
        let params = {
          username:this.username,
          password:this.password
        }
        api.post('login', null, params)
            .then(res=>{
              if(res.code===0){
                // this.$Spin.hide();
                /*let flag = true
                this.$store.commit('login',flag);*/
                this.$router.push({path:'/'});
              }
            }).catch(err => {
          return this.$Message.error({
            content:err.msg || '用户名或密码错误',
            duration:3
          })
        })
      }
    },
    mounted:function (){}
  }
</script>

<style scoped lang="less">
  .login{
    width:350px;
    padding:20px;
    position: absolute;
    border:1px solid #ccc;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    .btn{
      margin-bottom:10px;
    }
  }

</style>