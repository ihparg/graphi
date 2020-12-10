import fetch from '@/utils/fetch'

const getters = {
  appRole(state, getter, rootState, rootGetters) {
    if (state.id === '0') return 0
    const uid = rootGetters['user/currentUser']._id
    const user = state.app.users.find(u => u.user._id === uid)
    return user ? user.role : 0
  },
  isOwner(state, getter, rootState, rootGetters) {
    if (state.id === '0') return false
    const uid = rootGetters['user/currentUser']._id
    return state.app.owner._id === uid
  },
  isMaintainer(state, getter) {
    return getter.appRole === 1
  },
  isTester(state, getter) {
    return getter.appRole === 1 || getter.appRole === 3
  },
  isDeveloper(state, getter) {
    return getter.appRole === 1 || getter.appRole === 2
  },
  isGuset(state, getter) {
    return getter.appRole !== 0
  },
}

const actions = {
  async fetchById({ state }, id) {
    if (state.status === 200 && state.id === id) return

    if (id === '0') {
      state.app = { visibility: 2 }
      state.id = '0'
      state.status = 200
      return
    }

    state.status = 0
    try {
      const res = await fetch.get(`/api/app/${id}`)
      state.app = res
      state.status = 200
    } catch (e) {
      state.status = e.status
    }
  },

  async addMember({ state }, user) {
    state.app.users.push(user)
  },

  async removeMember({ state }, _id) {
    state.app.users = state.app.users.filter(u => u.user._id !== _id)
  },
}

export default {
  namespaced: true,
  state: () => ({ status: 0 }),
  getters,
  actions,
}
