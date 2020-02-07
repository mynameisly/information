<template>
  <div id="notfind">
      <div class="notfind_container">
        <h1 style="margin: 0;text-align: center;padding: 50px 0;"> <stong>404错误！抱歉您要找的页面不存在</stong> </h1>
        <div class="imgBox">
            <div>
                <img src="@/assets/404_imgs/ds1.gif">
                <div style="font-size:20px"><strong> 卧槽！页面不见了！</strong></div>
            </div>
            <div>
              <img src="@/assets/404_imgs/ds2.png" width="260">
            </div>
          </div>
          <div class="tipsBox">
            <el-button type="warning" @click='toHome'>返回首页</el-button>
            <el-button type="primary" @click='reloadPage'>重新加载</el-button>
            <el-button type="info">保证不打死管理员</el-button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    toHome () {
      this.$router.push({ path: '/home' })
    },
    reloadPage () {
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.notfind_container {
  width: 100%
}
.imgBox {
  display: flex;
  justify-content: space-around
}
.tipsBox {
  text-align: center;

}
</style>
