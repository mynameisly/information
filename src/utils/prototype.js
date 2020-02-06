import request from '@/utils/request.js'
import sha1 from "@/utils/sha1.js"
import Vue from 'vue'

Vue.prototype.$http = request;// 在全局注册api请求
Vue.prototype.$sha1 = sha1;// 全局注册sha1加密方法

// 判断对象是否为空
Vue.prototype.$isEmpty = function(obj) {
  if (obj === undefined || obj === null || obj === '') {
    return true
  }
  return false
}



