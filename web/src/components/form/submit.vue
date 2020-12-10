<template>
  <ui-button
    color="primary"
    :button-type="buttonType"
    :disabled="form.disabled"
    @click="handleClick"
  >
    <slot />
  </ui-button>
</template>

<script>
import { inject } from 'vue'
import { FormSymbol } from './form'

export default {
  props: {
    submit: Function,
    buttonType: {
      type: String,
      default: 'button',
    },
  },
  setup() {
    const form = inject(FormSymbol)
    return { form }
  },
  methods: {
    handleClick() {
      this.form.submit(this.submit)
    },
  },
}
</script>
