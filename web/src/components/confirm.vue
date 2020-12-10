<template>
  <ui-popover :position="position" class="pop-confirm">
    <slot />
    <div class="button">
      <ui-button color="red" @click="action">
        确定
      </ui-button>
    </div>
  </ui-popover>
</template>

<script>
export default {
  props: {
    action: Function,
    position: {
      type: String,
      default: 'top-end',
    },
  },
}
</script>

<style lang="scss" scoped>
.pop-confirm {
  padding: 1rem;

  .button {
    margin-top: 1rem;
    text-align: right;
  }
}
</style>
