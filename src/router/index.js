import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
import {
  isEmpty
} from "../utils/prototype"

import pub from './pub.js'

Vue.use(Router)

// 所有角色都可以访问的页面
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    name: 'login'
  },
  { // 重置密码
    path: '/resetPwd',
    component: () => import('@/components/resetPwd'),
    name: 'resetPwd'
  },
  { // 查看视频
    path: '/baberrage',
    component: () => import('@/views/pub/video/baberrage'),
    name: 'baberrage'
  },
  { // 修改密码
    path: '/updatePwd',
    component: () => import('@/components/updatePwd'),
    name: 'updatePwd'
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    name: 'register'
  },
  {
    path: '/loginout',
    component: () => import('@/views/loginout/loginout'),
    name: 'loginout'
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    name: '404'
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    name: '401'
  },
  {
    path: '/home',
    component: () => import('@/views/index'),
    name: 'home',
    children: [].concat(pub) // 在这里引入注册模块的路由
  }
]
// 需动态判断权限的路由
export const asyncRoutes = [
  {
    path: '/home',
    component: () => import('@/views/index'),
    children: [].concat(pub) // 在这里引入注册模块的路由
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  // mode:"history",
  routes: constantRoutes || store.getters.permission_routes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 未登陆的用户会被自动导航到login
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }
  if (store.state.app.isLogin === 1) {
    next()
    return
  }
  next()
})
export default router
