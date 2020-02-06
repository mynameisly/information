import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/token'
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect'] // 白名单不需要重定向

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  const hasToken = getToken();

  // 具有token
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/home' });
      NProgress.done();
    } else {
      const hasRole = store.getters.roles && store.getters.roles.length > 0;
      // 是否具有roles
      if (hasRole) {
        next();
      } else {
        try {
          await store.dispatch('user/getInfo');
          const roles = store.getters.roles;

          // 根据当前roles动态生成权限路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 将角色对应路由添加到普通路由中
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          // 重置token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //   没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done();
})
