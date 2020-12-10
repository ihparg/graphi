import { h, inject } from 'vue'
import { getUid } from '@/utils/uid'
import { TABLE_SYMBOL } from './data'

export default {
  props: {
    title: String,
    name: String,
    style: Object,
    class: String,
  },
  setup(props, { slots }) {
    const columns = inject(TABLE_SYMBOL)
    const id = getUid()
    columns.push({ ...props, $slots: slots, $id: id })

    const destroy = () => {
      const index = columns.findIndex(c => c.$id === id)
      columns.splice(index, 1)
    }

    return { destroy }
  },
  beforeUnmount() {
    this.destroy()
  },
  render() {
    return h('col', { style: this.style, class: this.class })
  },
}
