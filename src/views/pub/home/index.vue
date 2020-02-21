<template>
  <div id="home">
    <div class="container">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
.container {
  background: pink;
  height: 90vh; // 高度需要在笔记本上测试一下
  background: url('~@/assets/home.png'); // 背景图可选择有“欢迎使用”字样的，也可选择没有字的
  background-size: 100% 100%; // 背景图的尺寸需要在笔记本上测试一下
}
</style>
