<template>
  <div @keyup.enter="register">
    <Card class="register">
      <p slot="title" style="color:#333;font-size:20px;margin-bottom:20px">PPTV-任务系统后台</p>
      <div class="btn">
        <label for="phone" style="width:80px;display: inline-block;text-align: right">手机号</label>
        <Input v-model="username" clearable style="width:200px" id="phone"/>
      </div>
      <div class="btn">
        <label for="password" style="width:80px;display: inline-block;text-align: right">密&nbsp;&nbsp;&nbsp;码</label>
        <Input v-model="password" clearable style="width:200px" id="password" placeholder="6-12位,字母数字下划线" type="password"/>
      </div>
      <div class="btn">
        <label for="againPass" style="width:80px;display: inline-block;text-align: right">确认密码</label>
        <Input v-model="cpassword" clearable style="width:200px" id="againPass" type="password"/>
      </div>
      <Button @click="register">确定</Button>
    </Card>
  </div>
</template>

<script>
  import api from '../libs/API'
  export default {
    name: "Register",
    data(){
      return {
        username:'',
        password:'',
        cpassword:''
      }
    },
    methods:{
      register () {
        if(this.username === ''){
          return this.$Message.warning({
            content:'手机号不能为空',
            duration:3
          })
        }
        if(this.password===''){
          return this.$Message.warning({
            content:'密码不能为空',
            duration:3
          })
        }
        if(this.cpassword===''){
          return this.$Message.warning({
            content:'确认密码不能为空',
            duration:3
          })
        }
        if(this.password!=this.cpassword){
          return this.$Message.warning({
            content:'密码不一致',
            duration:3
          })
        }
        this.$Spin.show();
        api.post('register',null,{username:this.username,password:this.password,cpassword:this.cpassword})
            .then(res=>{
              if(res.code === 0){
                this.$Spin.hide();
                this.$Message.success({
                  content:res.msg || '注册成功',
                  duration:3
                })
                this.$router.push({path:'/login'})
              }
            })
            .catch(err=>{
              console.log(err)
              this.$Spin.hide();
              return this.$Message.error({
                content:err.msg || '注册失败稍后再试',
                duration:3
              })
            })
      }
    }
  }
</script>

<style scoped lang="less">
  .register{
    position: absolute;
    border:1px solid #ccc;
    padding:20px;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    .btn{
      margin-bottom:10px;
    }
  }

</style>