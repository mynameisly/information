<template>
  <div id="restPwd">

  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {

    }
  },
  mounted () {
    this.restPwd(userId)
  },
  methods: {
    restPwd (userId) { // 重置密码
      this.$confirm('是否重置密码为123abc?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      }).then((res) => {
        // 点击确定后发送请求
        axios.put('/json/user/resetPassword?userId=' + userId).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '重置密码成功'
            })
          }
          this.$router.push({ name: 'login' })
        })
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '取消重置'
        })
        this.$router.push({ name: 'login' })
      })
    }
  }
}
</script>

<style lang="scss">

</style>
