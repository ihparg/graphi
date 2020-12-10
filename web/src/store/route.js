import fetch from '@/utils/fetch'

const actions = {
  async fetchList({ state }, { aid }) {
    if (state.data && state.aid === aid) return

    const data = await fetch.get(`/api/route/${aid}`)
    if (`${aid}` !== '0') {
      data.forEach(d => {
        d.$undone = true
      })
    }
    const resolves = await fetch.get(`/api/resolve/${aid}/list`)

    state.aid = aid
    state.data = data
    state.resolves = resolves
  },

  async fetchOne({ state }, { aid, id }) {
    const route = await fetch.get(`/api/route/${aid}/${id}`)
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
  getters,
}
