<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!-- 登录表单区域 -->
      <el-form label-width="0" class="form_box"
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input
          v-model="loginForm.name">
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="psw">
          <el-input prefix-icon="el-icon-lock" type="password"
          v-model="loginForm.psw">

          </el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary"
          @click="login">登录</el-button>
          <el-button type="info"
          @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import userApi from '../api/userApi';
import {Message} from 'element-ui';
export default {
  data () {
    let validateName = (rule,value,callback) =>{
      const regName = /^[a-z][a-z0-9]{2,9}/i;
      if(regName.test(value)){
        callback();
      }else{
        callback(new Error('用户名只能是字母和数字组成，并且字母开头,长度为3-10'));
      }
    }
    return {
      loginForm:{
        name:'admin',
        psw:'123456',
      },
      /* 表单的验证规则对象 */
      loginRules:{
        name:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        psw:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  components: {},

  methods: {
    /* 重置登录表单 */
    reset(){
      this.$refs.loginFormRef.resetFields();
    },
    /* 发起登录请求 */
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        //valid为true，表单正则验证都通过了才发请求
        if(!valid)return; //不通过直接return
        const {data: res} = await userApi.login(this.loginForm.name,this.loginForm.psw);
        if(res.meta.status !== 200) {
            Message.error({
              message: '登录失败',
              duration:2000,
            })
        }else{
            Message.success({
              message: '登录成功',
              duration:2000,
            });
          //把登录成功用户的token保存到sessionStorage中
          window.sessionStorage.setItem('token',res.data.token);
          //跳转到首页
          this.$router.push('/home');
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/login.scss";
</style>