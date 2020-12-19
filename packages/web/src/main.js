import { createApp } from 'vue'
import registerUI from './ui'
import registerComponents from './components'
import registerDirectives from './directives'
import App from './App.vue'
import router from './router'
import store from './store'
import message from './components/message'
import { setStore } from './utils/fetch'
import '@/assets/normalize.min.css'

const app = createApp(App)

registerUI(app)
registerComponents(app)
registerDirectives(app)

setStore(store)

app
  .use(router)
  .use(store)
  .use(message)
  .mount('#app')
