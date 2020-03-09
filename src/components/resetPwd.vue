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
    this.restPwd()
  },
  methods: {
    restPwd () { // 重置密码
      this.$confirm('是否重置密码为123abc?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: 'true'
      }).then((res) => {
        // 点击确定后发送请求
        axios.put('/json/user/resetPassword').then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '重置密码成功'
            }).then(() => { // 不知道这里可以加 .then()方法不
              this.$confirm('是否修改密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                center: 'true'
              }).then(() => {
                this.$router.push({ name: 'updatePwd' })
              }).catch(() => {
                this.$router.push({ name: 'login' })
              })
            })
          }
        })
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '取消重置'
        }).then((res) => {
          this.$router.push({ name: 'login' })
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>
