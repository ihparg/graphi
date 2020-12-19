import Loading from './loading.vue'
import Icon from './icon.vue'
import Search from './search.vue'
import Confirm from './confirm.vue'
import registerForm from './form'
import Tabs from './tabs/index.vue'
import Tab from './tabs/tab.vue'
import Table from './table/index.vue'
import TableCol from './table/col'
import NotFound from './not-found.vue'
import Nav from './nav.vue'
import Drawer from './drawer.vue'
import Forbidden from './forbidden.vue'
import FabAdd from './fab-add.vue'
import Clipboard from './clipboard.vue'

export default app => {
  app.component('VLoading', Loading)
  app.component('VIcon', Icon)
  app.component('VSearch', Search)
  app.component('VConfirm', Confirm)
  app.component('VTabs', Tabs)
  app.component('VTab', Tab)
  app.component('VNotFound', NotFound)
  app.component('VTable', Table)
  app.component('VTableCol', TableCol)
  app.component('VNav', Nav)
  app.component('VDrawer', Drawer)
  app.component('VForbidden', Forbidden)
  app.component('VFabAdd', FabAdd)
  app.component('VClipboard', Clipboard)

  registerForm(app)
}
