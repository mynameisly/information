<template>
  <div id="updatePwd">
    <el-form :model="searchFrom">
      <el-form-item label="原密码">
        <el-input
          v-model="searchForm.oldPassword"
          placeholder="请输入6位原密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="searchForm.newPassword"
          placeholder="新密码长度必须在6-16之间，且必须包含数字和字母"
          show-password >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="info"
          size="mini"
          icon="el-icon-edit-outline"
          @click="updatePwd">
          修改密码
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
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
      searchForm: {
        oldPassword: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    updatePwd () { // 修改密码
      axios.put('/json/user/updatePassword?oldPassword=' + this.searchForm.oldPassword + '&newPassword=' + this.searchForm.newPassword).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改密码成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
