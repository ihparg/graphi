import fetch from '@/utils/fetch'
import { array2Object } from '@/utils/objects'
import { flattenSchemasFromArray } from '@/utils/schema'

const getters = {
  flattenedSchemas(state) {
    if (!state.data) return {}
    return flattenSchemasFromArray(Object.values(state.data))
  },
}

const actions = {
  async fetchAll({ state }, { aid }) {
    if (state.data && state.aid === aid) return

    const res = await fetch.get(`/api/schema/${aid}/list`)
    state.aid = aid
    state.data = array2Object(res, 'name')
  },

  async save({ state }, { data, oldName, success }) {
    const schema = await fetch.post(`/api/schema/${data.aid}/save`, data)

    delete state.data[oldName]
    state.data[schema.name] = schema
    if (success) success(schema)
  },
}

export default {
  namespaced: true,
  getters,
  actions,
}
