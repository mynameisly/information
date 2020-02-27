<template>
  <div id="particlesId">
    <h1 class="title">科成学生助手系统</h1>
    <div class="register-wrap">
      <el-form ref="regForm" :model="regForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名:" prop="username">
              <el-input
                v-model="regForm.username"
                prefix-icon="el-icon-user"
                placeholder="用户名长度必须在6-16之间，且不能包含非法字符*#@"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="密码:" prop="password">
              <el-input
                v-model="regForm.password"
                prefix-icon="el-icon-lock"
                placeholder="密码长度必须在6-16之间，且必须包含数字和字母"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button
                style="margin:auto;width:100%;font-size:1.1rem;display:block"
                type="success"
                @click="isConfirm"
              >立 即 注 册</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import particlesConfig from '@/assets/particleConfig.json'
import axios from 'axios'
export default {
  data () {
    const validateNumber = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]{6,16}$/; // 账号长度必须在6-16之间，且不能包含非法字符*#@
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
      // var lowercase = //
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
      regForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, validator: validateNumber, trigger: 'blur'}],
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
    isConfirm (regForm) {
      this.$refs.regForm.validate((valid) => {
        if (valid) {
          const username = this.regForm.username
          const password = this.regForm.password
          axios.post('json/register/direct?number=' + username + '&password=' + password).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '注册成功'
              })
              this.$router.push({path: '/login'}) // 跳转到登录页面
            } else if (res.data.code === 13) {
              this.$message({ // 用户名不可以重复，密码可以重复
                type: 'warning',
                message: '注册失败，账号已存在'
              })
            }
          })
        } else {
          return false
        }
      })
    }
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
#particlesId .title{
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%, -50%);
  color: #fff;
}
.register-wrap{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 0;
  padding-right: 30px;
  width: 530px;
  background-color: rgba(49,143,254,.4);
  border-radius: 10px;
  box-shadow: 0px 0px 5px lavenderblush;
    .el-form
      .el-row:nth-child(1),
      .el-row:nth-child(2) {
      margin-bottom: 20px;
    }
}
</style>
