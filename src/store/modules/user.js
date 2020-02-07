// import { setToken, getToken, removeToken } from '../../utils/token'
const state = {
  // token: getToken(),
  username: '',
  // imageUrl: '',
  // roles: [],
  // data: {}
}

const mutations = {
  // USER_MUTATION: (state, userdata) => {
  //   setToken(userdata.token)
  //   state.token = userdata.token
  //   state.data = userdata
  // },
  USER_STATUS: (state, user) => { // 我写的
    if (user) {
      state.username = user
    } 
    // else if (user == null) {
    //   sessionStorage.setItem('username', null)
    //   state.username = null
    // }
  }
}

const actions = {
  // setUserdata ({ commit }, userdata) {
  //   commit('USER_MUTATION', userdata)
  // },

  // getInfo ({ commit, state }) {
  //   const data = state.data
  //   state.username = data.uname
  //   state.imageUrl = data.imageUrl
  //   state.roles = data.roles
  // },
  // remove Token
  // resetToken ({ commit, state }) {
  //   return new Promise(resolve => {
  //     commit('USER_MUTATION', '')
  //     state.roles = []
  //     removeToken()
  //     resolve()
  //   })
  // },
  setUser ({ commit }, user) { // 我写的
    commit('USER_STATUS', user)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
