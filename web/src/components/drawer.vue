<template>
  <div class="bg-over" @click.self="bgClick">
    <div class="drawer" :style="{ width, top, padding }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '24rem',
    },
    top: {
      type: String,
      default: '3.5rem',
    },
    padding: {
      type: String,
      default: '1.5rem',
    },
  },
  emits: ['close'],
  methods: {
    bgClick() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes drawer-move-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.bg-over {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.1);
}

.drawer {
  position: absolute;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: $box-shadow;
  overflow: auto;
  animation: drawer-move-in 0.216s;
}
</style>
