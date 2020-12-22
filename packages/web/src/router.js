import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/home/index.vue'
import Schema from './views/schema/index.vue'
import SchemaDetail from './views/schema/detail.vue'
import Route from './views/route/index.vue'
import RouteDetail from './views/route/detail.vue'
import User from './views/user/index.vue'
import NoAuth from './views/user/noauth.vue'
import App from './views/app/index.vue'
import Member from './views/member/index.vue'
import Recycle from './views/app/recycle.vue'
import Tokens from './views/app/tokens.vue'
import Versions from './views/app/version.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/noauth', component: NoAuth },
  {
    path: '/app/:aid',
    component: App,
    children: [
      { path: 'schema', component: Schema },
      { path: 'schema/:name', component: SchemaDetail },
      { path: 'route', component: Route },
      { path: 'route/:rid', component: RouteDetail },
      { path: 'users', component: User },
      { path: 'member', component: Member },
      { path: 'recycle', component: Recycle },
      { path: 'tokens', component: Tokens },
      { path: 'version', component: Versions },
    ],
  },
]

export const history = createWebHistory()

export default createRouter({
  history,
  routes,
})
