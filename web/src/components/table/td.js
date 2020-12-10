import { h } from 'vue'

export default {
  props: {
    column: Object,
    data: Object,
  },
  render() {
    const { name, $slots } = this.column
    let children
    if ($slots.default) children = $slots.default(this.data)
    else if (name) children = this.data[name]

    return h('td', {}, children)
  },
}
