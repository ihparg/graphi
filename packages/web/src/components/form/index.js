import UiTextbox from '@/ui/UiTextbox.vue'
import UiSelect from '@/ui/UiSelect.vue'
import UiCheckbox from '@/ui/UiCheckbox.vue'
import UiAutocomplete from '@/ui/UiAutocomplete.vue'
import UiSwitch from '@/ui/UiSwitch.vue'
import { register, setDefaultComponent } from './components'
import Form from './form'
import Input from './input'
import Submit from './submit.vue'
import MemberSelect from './member-select.vue'

setDefaultComponent(UiTextbox)

register('select', UiSelect)
register('checkbox', UiCheckbox)
register('autocomplete', UiAutocomplete)
register('switch', UiSwitch)
register('member-select', MemberSelect)

export const registerInput = register

export default app => {
  app.component('VForm', Form)
  app.component('VInput', Input)
  app.component('VSubmit', Submit)
}
