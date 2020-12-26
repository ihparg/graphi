import fetch from '@/utils/fetch'
import message from '@/components/message'

const mutations = {
  CHANGE_STATUS(state, { _id, status }) {
    const route = state.data.find(d => d._id === _id)
    route.status = status
    state.data = [...state.data]
  },
  REMOVE(state, _id) {
    state.data = state.data.filter(d => d._id !== _id)
  },
  SET_ROUTE(state, route) {
    const index = state.data.findIndex(d => d._id === route._id)
    if (index >= 0) state.data[index] = route
    else state.data.push(route)
  },
  SET_RESOLVES(state, resolves) {
    state.resolves = resolves
  },
}

const actions = {
  async fetchList({ state }, { aid }) {
    if (state.aid === aid) return

    const data = await fetch.get(`/api/route/${aid}`)
    if (`${aid}` !== '0') {
      data.forEach(d => {
        d.$undone = true
      })
    }

    let resolves = null
    try {
      resolves = await fetch.get(`/api/resolve/${aid}/list`)
    } catch (e) {
      message.show('resolve 获取失败', 'error')
    }

    state.aid = aid
    state.data = data
    state.resolves = resolves
  },

  async fetchOne({ state }, { aid, id }) {
    const route = await fetch.get(`/api/route/${aid}/detail/${id}`)
    const index = state.data.indexOf(d => d.id === id)
    state.data[index] = route

    state.data = state.data.filter(d => d._id !== id)
    state.data.push(route)
  },

  async save({ state }, { data, success }) {
    const route = await fetch.post(`/api/route/${data.aid}/save`, data)

    if (data._id) state.data = state.data.filter(d => d._id !== data._id)
    state.data = [...state.data, route]

    if (success) success(route)
  },

  async fetchVersions({ state }, { type, func }) {
    const versions = state.resolves[type][func]
    if (versions == null) return
    if (versions === 'loading' || versions.length > 0) return
    state.resolves[type][func] = 'loading'
    state.resolves[type][func] = await fetch.post(`/api/resolve/${state.aid}/versions`, {
      type,
      func,
    })
  },
}

const getters = {
  sortedRoutes(state) {
    if (!state.data) return null
    return state.data.sort((a, b) => (a.path + a.method).localeCompare(b.path + b.method))
  },
}

export default {
  namespaced: true,
  actions,
  mutations,
  getters,
}
