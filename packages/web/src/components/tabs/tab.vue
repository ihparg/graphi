<template>
  <div :style="{ display: show ? 'block' : 'none' }">
    <slot />
  </div>
</template>

<script>
import { nextUid } from '@/utils/uid'

export default {
  props: {
    avariable: Boolean,
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
  created() {
    if (this.avariable) this.$parent.addTab(this)
  },
}
</script>
