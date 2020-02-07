
const state = {
  sidebar: {
    opened: false
  },
  themeColor: '#0099CC',
  isLogin: 0 // 初始时候给 isLogin=0表示未登录
}

const mutations = {
  // 改变登录状态， 为1表示已登录
  CHANGE_LOGIN (state) {
    state.isLogin = 1
  },
  // sidebar切换
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
  },
  CLOSE_SIDEBAR: (state) => {
    state.sidebar.opened = false
  },
  OPEN_SIDEBAR: (state) => {
    state.sidebar.opened = true
  },
  // 主题切换
  TOGGLE_COLOR: (state, color) => {
    state.themeColor = color
    // 动态修改homeicon颜色
    const homeicon = document.getElementById('homeIcon')
    homeicon.style.color = state.themeColor
    const homespan = document.querySelector('#homeIcon+span')
    homespan.style.color = state.themeColor
  }
}

const actions = {
  changeLogin ({ commit }) {
    commit('CHANGE_LOGIN')
  },
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar ({ commit }) {
    commit('CLOSE_SIDEBAR')
  },
  openSideBar ({ commit }) {
    commit('OPEN_SIDEBAR')
  },
  toggleColor ({ commit }, color) {
    commit('TOGGLE_COLOR', color)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
