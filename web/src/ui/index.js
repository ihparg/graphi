import UiButton from './UiButton.vue'
import UiFab from './UiFab.vue'
import UiTextbox from './UiTextbox.vue'
import UiCheckbox from './UiCheckbox.vue'
import UiModal from './UiModal.vue'
import UiPopover from './UiPopover.vue'
import UiSnackbarContainer from './UiSnackbarContainer.vue'
import UiSwitch from './UiSwitch.vue'
import UiSelect from './UiSelect.vue'

export default app => {
  app.component('UiButton', UiButton)
  app.component('UiFab', UiFab)
  app.component('UiTextbox', UiTextbox)
  app.component('UiCheckbox', UiCheckbox)
  app.component('UiPopover', UiPopover)
  app.component('UiModal', UiModal)
  app.component('UiSnackbarContainer', UiSnackbarContainer)
  app.component('UiSwitch', UiSwitch)
  app.component('UiSelect', UiSelect)
}
