import { createStore } from 'vuex'
import app from './app'
import route from './route'
import schema from './schema'
import user from './user'

export default createStore({
  modules: {
    app,
    route,
    schema,
    user,
  },
})
