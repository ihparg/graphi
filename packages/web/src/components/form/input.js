import { ref, inject, h } from 'vue'
import validateFunc from '@/utils/validate'
import { deepGet, deepSet, deepRemove } from '@/utils/objects'
import { FormSymbol } from './form'
import getTag from './components'

export default {
  props: {
    component: Object,
    defaultValue: null,
    name: String,
    rules: Array,
    type: { type: String, default: 'textbox' },
  },
  inheritAttrs: false,
  setup({ name, rules, defaultValue }) {
    const form = inject(FormSymbol)
    const value = ref(deepGet(form.data, name))

    if (value.value == null && defaultValue !== undefined) {
      deepSet(form.data, name, defaultValue)
      value.value = defaultValue
    }

    const validate = v => {
      if (v === undefined) v = value.value
      return validateFunc(v, form.data, rules, { name })
        .then(() => {
          delete form.errors[name]
          return true
        })
        .catch(e => {
          form.errors[name] = e.message
          return e
        })
    }

    form.validates[name] = validate

    return { form, validate, value }
  },
  watch: {
    // eslint-disable-next-line func-names
    'form.data': {
      handler(val) {
        this.value = deepGet(val, this.name)
      },
      deep: true,
    },
  },
  unmounted() {
    if (this.form.willDestroy) return

    delete this.form.validates[this.name]
    delete this.form.errors[this.name]
    deepRemove(this.form.data, this.name)
  },
  render() {
    const tag = this.component ? this.component : getTag(this.type)

    const props = {
      disabled: this.form.disabled,
      ...this.$attrs,
      help: this.form.disabled ? undefined : this.$attrs.help,
      name: this.name,
      value: this.value,
      invalid: !!this.form.errors[this.name],
      error: this.form.errors[this.name],
    }

    if (['number', 'password'].includes(this.type)) props.type = this.type

    return h(tag, {
      ...props,
      onInput: v => {
        if (this.type === 'select' && v != null && typeof v === 'object' && 'value' in v) {
          v = v.value
        }
        deepSet(this.form.data, this.name, v, { forceSet: true })
        if (this.rules) this.validate(v)
        this.$emit('input', v)
      },
    })
  },
}
