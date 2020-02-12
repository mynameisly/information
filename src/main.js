// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
// import echarts from 'echarts'
import particlesJS from 'particles.js'
import '@/utils/prototype'
// import locale from 'element-ui/lib/locale/lang/zh-CN';
import { vueBaberrage } from './views/lib/index'
Vue.use(vueBaberrage)
// import i18n from './i18n';

Vue.use(ElementUI)
// Vue.use(ElementUI,{locale});
Vue.use(particlesJS)
Vue.prototype.$routeTo = function (path, params) {
  if (undefined === params || params == null) {
    this.$router.push({ path: path })
  } else this.$router.push({ path: path, query: params })
}

Vue.config.productionTip = false
// Vue.prototype.$ajax = axios
// Vue.prototype.$echarts = echarts

// var instance = axios.create({
//   baseURL: '',
//   timeout: 5000,
//   headers: {'Content-Type': 'multipart/form-data'}
// })
// Vue.prototype.axios = axios
// Vue.prototype.instance = instance

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App)
})
