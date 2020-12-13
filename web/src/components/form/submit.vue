<template>
  <ui-button
    color="primary"
    :button-type="buttonType"
    :disabled="form.disabled"
    :loading="isLoading"
    @click="handleClick"
  >
    <slot>提交</slot>
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
    loading: Boolean,
  },
  emits: ['submit'],
  setup() {
    const form = inject(FormSymbol)
    return { form }
  },
  computed: {
    isLoading() {
      return this.loading || this.form.loading
    },
  },
  methods: {
    handleClick() {
      this.form
        .validate()
        .then(() => {
          if (this.form.submit) this.form.submit(this.form.data)
          this.$emit('submit', this.form.data)
        })
        .catch(() => {})
    },
  },
}
</script>
