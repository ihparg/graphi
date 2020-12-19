import { provide, reactive } from 'vue'
import { deepSet } from '@/utils/objects'

export const FormSymbol = Symbol('form')

export default {
  props: {
    data: { type: Object, default: () => ({}) },
    disabled: Boolean,
    loading: Boolean,
    submit: Function,
  },
  setup(props) {
    const data = reactive(props.data)
    const errors = reactive({})
    const validates = reactive({})

    const validate = () => {
      return Promise.all(Object.values(validates).map(f => f())).then(res => {
        res.forEach(r => {
          if (r !== true) throw r
        })
        return true
      })
    }

    const form = reactive({
      data,
      disabled: props.disabled,
      errors,
      loading: props.loading,
      submit: props.submit,
      validates,
      validate,
    })

    provide(FormSymbol, form)

    return {
      form,
      validate,
    }
  },
  watch: {
    data(val) {
      this.form.data = val
    },
    disabled(val) {
      this.form.disabled = val
    },
    loading(val) {
      this.form.loading = val
    },
  },
  methods: {
    setValue(key, value) {
      deepSet(this.form.data, key, value, { forceSet: true })
    },
    handleEnterSubmit(event) {
      if (this.loading) return
      if (event.keyCode === 13 && this.submit && event.target.tagName !== 'TEXTAREA') {
        this.validate()
          .then(() => {
            this.submit(this.form.data)
          })
          .catch(() => {})
      }
    },
  },
  beforeUnmount() {
    this.form.willDestroy = true
  },
  render() {
    const submit = this.submit ? this.handleEnterSubmit : undefined
    return <div onKeyup={submit}>{this.$slots.default()}</div>
  },
}
