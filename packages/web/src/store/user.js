import fetch from '@/utils/fetch'

const getters = {
  currentUser(state) {
    return state.currentUser
  },
  isAdmin(state) {
    return state.currentUser.role === 1
  },
}

const mutations = {
  SET_LOGIN_STATE(state, status) {
    state.currentUser = status
  },
}

const actions = {
  async fetchCurrentUser({ state }) {
    const user = await fetch.get('/api/user/info')
    state.currentUser = user
  },

  async fetchUsers({ state }) {
    if (state.users) return
    const users = await fetch.get('/api/user/list')
    state.users = users
  },

  async fetchUsersCount({ state, dispatch }) {
    if (state.userCount == null) {
      const count = await fetch.get('/api/user/listCount')
      state.usersCount = count
      if (count < 1000) dispatch('fetchUsers')
    }
  },

  async logout({ state }) {
    await fetch.post('/api/user/logout')
    state.currentUser = 0
  },
}

export default {
  namespaced: true,
  getters,
  actions,
  mutations,
}
