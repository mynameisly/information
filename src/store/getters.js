const getters = {
  sidebar: state => state.app.sidebar,
  themeColor: state => state.app.themeColor,
  token: state => state.user.token,
  username: state => state.user.username,
  usertype: state => state.user.usertype,
  imageUrl: state => state.user.imageUrl,
  roles: state => state.user.roles,
  // 当前用户具有的权限路由列表
  permisstion_routes: state => state.permission.routes
}
export default getters
