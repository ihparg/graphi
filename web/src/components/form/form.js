import { provide, reactive } from 'vue'
import { deepSet } from '@/utils/objects'

export const FormSymbol = Symbol('form')

export default {
  props: {
    data: { type: Object, default: () => ({}) },
    disabled: Boolean,
  },
  setup(props) {
    const data = reactive(props.data)
    const errors = reactive({})
    const validates = reactive({})
    let form

    const handleSubmit = submit => {
      Promise.all(Object.values(validates).map(f => f())).then(res => {
        if (res.every(r => r === true)) submit(form.data)
      })
    }

    form = reactive({
      data,
      disabled: props.disabled,
      errors,
      validates,
      submit: handleSubmit,
    })

    provide(FormSymbol, form)

    return {
      form,
      validates,
    }
  },
  watch: {
    data(val) {
      this.form.data = val
    },
    disabled(val) {
      this.form.disabled = val
    },
  },
  methods: {
    validate() {
      return Promise.all(Object.values(this.validates).map(f => f())).then(res => {
        res.forEach(r => {
          if (r !== true) throw r
        })
        return true
      })
    },
    setValue(key, value) {
      deepSet(this.form.data, key, value, { forceSet: true })
    },
  },
  beforeUnmount() {
    this.form.willDestroy = true
  },
  render() {
    return this.$slots.default()
  },
}
