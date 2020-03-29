<template>
  <div id="particlesId">
    <h1 class="title">科成学生助手系统</h1>
    <div class="login-warp">
      <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名:" prop="username">
              <el-input
                prefix-icon="el-icon-user"
                v-model="loginForm.username"
                placeholder="用户名长度必须在6-16之间，且不能包含非法字符*#@" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="密码:" prop="password">
              <el-input
                prefix-icon="el-icon-key"
                v-model="loginForm.password"
                placeholder="密码长度必须在6-16之间，且必须包含数字和字母"
                show-password
               />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
            <el-form-item>
              <el-button
                style="width:100%;"
                type="success"
                @click="login('loginForm')"
              >登 录</el-button>
            </el-form-item>
        </el-row>

        <el-row style="margin-top:20px">
          <el-col :span="16" :offset="4">
              <router-link
                style="visibility: hidden;"
                tag="a"
                :to="{ name: 'resetPwd' }"
               >忘 记 密 码
              </router-link>
          </el-col>
          <el-col :span="4">
            <router-link
              tag="a"
              :to="{ name: 'register' }"
              >立 即 注 册
              </router-link>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import particlesConfig from '@/assets/particleConfig.json'
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
  data () {
    const validateNumber = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]{6,16}$/; // 账号长度必须在5-16之间，且不能包含非法字符*#@
      if (value === '' || value === undefined) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error('用户名长度必须在6-16之间'))
      } else if (value.indexOf('*') > 0 || value.indexOf('#') > 0 || value.indexOf('@') > 0) {
        callback(new Error('用户名不能含有非法字符*#@'))
      } else {
        if (reg.test(value)) {
          callback()
        }
      }
    }
    const validatePass = (rule, value, callback) => {
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,}$/ // 密码长度必须在6-16之间，且必须包含数字和字母
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error('密码长度必须在6-16之间'))
      } else if (/^[a-z]+$/.test(value) || /^[0-9]+$/.test(value)) {
        callback(new Error('密码必须同时包含数字和字母'))
      } else {
        if (reg.test(value)) {
          callback()
        }
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, validator: validateNumber, trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      particlesJS('particlesId', particlesConfig)
    },
    login (loginForm) {
      this.$store.dispatch('app/changeLogin')
      console.log('enter login!!')
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const username = this.loginForm.username
          const password = this.loginForm.password
          // 验证成功后发送请求，返回的数据就是information学籍信息
          axios.get('json/login/direct?number=' + username + '&password=' + password).then(res => {
            console.log(' login success')
            console.log(res.data)
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.$router.push({name: 'information'})
              const userData = res.data.data
              const user = userData.number
              // sessionStorage.setItem('username', user) // 把登录成功的用户名放入sessionStorage
              // this.$store.dispatch('setUser', user) // 把用户名放入vuex
              // ...mapActions('user/setUser',res.data.number)
              // setUser(res.data.number)
              console.log(userData)
              sessionStorage.setItem('userId', userData.userId)
              sessionStorage.setItem('roleId', userData.role.roleId)
              sessionStorage.setItem('number', user)
              sessionStorage.setItem('headImg', userData.headImg)
              sessionStorage.setItem('nickName', userData.nickName)
              sessionStorage.setItem('readName', userData.readName)
              sessionStorage.setItem('sex', userData.sex)
              sessionStorage.setItem('birthday', userData.birthday)
              sessionStorage.setItem('telPhone', userData.telPhone)
              sessionStorage.setItem('email', userData.email)
              sessionStorage.setItem('weiXin', userData.weiXin)
              sessionStorage.setItem('qq', userData.qq)
              sessionStorage.setItem('introduce', userData.introduce)
              sessionStorage.setItem('depict', userData.role.depict)
              this.setUser({ user })
            } else {
              this.$message({
                type: 'warning',
                message: '登录失败，用户名或密码错误'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    ...mapActions('user/', ['setUser'])
  }
}
</script>

<style lang="scss" scoped>
#particlesId{
  width: 100%;
  min-height: 100vh;
  display: flex;
  background-color: #000000;
}
.particles-js-canvas-el{
  height: 100vh!important;
}
#particlesId .title{
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%, -50%);
  color: #fff;
}
.login-warp{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 0;
  padding-right: 30px;
  width: 500px;
  background-color: rgba(49,143,254,.4);
  border-radius: 10px;
  box-shadow: 0px 0px 5px lavenderblush;
  .el-form
    .el-row:nth-child(1),
    .el-row:nth-child(2) {
    margin-bottom: 20px;
  }
}
.login-foot{
  display: flex;
  justify-content: space-between;
  margin-left: 45px;
  color: #fff;
}
</style>
