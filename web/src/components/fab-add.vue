<template>
  <ui-fab :color="color" class="add-button" :style="style" @click="handleClick">
    <v-icon name="add" size="2rem" />
  </ui-fab>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    color: { type: String, default: 'primary' },
    to: String,
    style: Object,
  },
  emits: ['click'],
  methods: {
    handleClick() {
      if (this.to) this.$router.push(this.to)
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.add-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
</style>
