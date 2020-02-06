<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span
          v-if="item.redirect==='noRedirect'||index==levelList.length-1"
          class="no-redirect"
          :style="{'color':`${themeColor}`}"
        >{{ item.meta.title }}</span>
        <span v-else :style="{'color':`${themeColor}`}" @click.prevent="handleLink(item)">首页</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'themeColor'])
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  created () {
    this.getBreadcrumb()
  },
  mounted () {
    this.addIcon()
  },
  methods: {
    // subheader的首页前添加了home图标
    addIcon () {
      // 添加图标
      const firstPage = document.getElementsByClassName('el-breadcrumb__inner')[0]
      const icon = document.createElement('i')
      icon.className = 'el-icon-s-home'
      icon.id = 'homeIcon'
      icon.style.color = this.themeColor
      firstPage.insertBefore(icon, firstPage.children[0])
      // 同时更改后面span的颜色
      const homespan = document.querySelector('#homeIcon+span')
      homespan.style.color = this.themeColor
    },
    getBreadcrumb () {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard (route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
    },
    pathCompile (path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink (item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    ...mapActions('app/', ['toggleColor'])
  }
}
</script>

<style lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  margin-left: 1.2rem;

  .no-redirect {
    cursor: text;
  }
}
#homeIcon {
  font-size: 1.1rem;
  + span {
    margin: 0 0 0 0.3rem;
    cursor: pointer;
  }
}
</style>
