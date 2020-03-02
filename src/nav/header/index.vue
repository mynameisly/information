<template>
  <div id="header" :style="{'background-color':`${themeColor}`,'box-shadow':`0 1px 2px ${themeColor}`}">
    <a>
      <img src="@/assets/logo.png" height="100%">
      <span>科成学生助手系统</span>
    </a>
    <header-item />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import HeaderItem from './header-item'
export default {
  components: {
    HeaderItem
  },
  computed: {
    isLogin () {
      if (this.$isEmpty(this.token)) {
        return false
      }
      return true
    },
    ...mapGetters(['token', 'themeColor'])
  },
  methods: {
    // logout() {
    //   this.setToken("");
    //   this.$routeTo("/login");
    //   sessionStorage.setItem("store", null);
    // },
    ...mapActions('user/', ['setToken'])
  }
}
</script>

<style lang="scss">
$hei: 3rem; //顶栏高度
$bg1:#33a0bb;
$bg2:rgb(228, 147, 26);
$bg3:rgb(76, 103, 136);
#header {
  width: 100%;
  // background-color:$bg1;
  height: 3rem;
  min-height: $hei;
  padding: 0 3rem;
  z-index: 100;
  // box-shadow: 0 1px 2px $bg1;
  a {
    img,
    span {
      padding: 0.2rem 0;
      vertical-align: middle;
      font-weight: bold;
      font-size: 20px;
      color: white;
    }
  }
  .logout {
    line-height: $hei;
    color: white;
    font-size: 0.8rem;
    float: right;
  }
}
</style>
