<template>
  <div :style="{ display: show ? 'block' : 'none' }">
    <slot />
  </div>
</template>

<script>
import { nextUid } from '@/utils/uid'

export default {
  props: {
    avariable: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: () => nextUid(),
    },
    title: String,
  },
  data() {
    return {
      activeId: null,
    }
  },
  computed: {
    show() {
      return this.activeId === this.id
    },
  },
  watch: {
    avariable(val) {
      if (val) this.$parent.addTab(this)
      else this.$parent.removeTab(this)
    },
  },
  created() {
    if (this.avariable) this.$parent.addTab(this)
  },
}
</script>
