<template>
  <i class="icon" :style="{ color, width: size, height: size }">
    <svg viewBox="0 0 24 24">
      <use :xlink:href="`#icon-${name}`" />
    </svg>
  </i>
</template>

<script>
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/svg', true, /\.svg$/)
requireAll(req)

export default {
  name: 'CIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    size: String,
  },
}
</script>

<style lang="scss" scoped>
.icon {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  user-select: none;
  align-items: center;
  justify-content: center;
  vertical-align: middle;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}
</style>
