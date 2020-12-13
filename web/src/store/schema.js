import fetch from '@/utils/fetch'
import { array2Object } from '@/utils/objects'
import { flattenSchemasFromArray } from '@/utils/schema'

const getters = {
  flattenedSchemas(state) {
    if (!state.data) return {}
    return flattenSchemasFromArray(Object.values(state.data))
  },
}

const mutations = {
  REMOVE(state, name) {
    delete state.data[name]
  },
  SET_SCHEMA(state, schema) {
    state.data[schema.name] = schema
  },
}

const actions = {
  async fetchAll({ state }, { aid }) {
    if (state.aid === aid) return

    const res = await fetch.get(`/api/schema/${aid}/list`)
    state.aid = aid
    state.data = array2Object(res, 'name')
  },
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
}
