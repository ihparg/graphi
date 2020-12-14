<template>
  <a href="javascript:;" class="btn-copy" @click="handleCopy">
    <v-icon name="copy" />
  </a>
</template>

<script>
export default {
  props: {
    data: String,
  },
  methods: {
    handleCopy() {
      const el = document.createElement('input')
      el.value = this.data
      el.style = 'position:fixed; top: -9999px; left: -9999px;'
      document.body.appendChild(el)
      el.select()
      el.setSelectionRange(0, 99999)
      document.execCommand('copy')
      document.body.removeChild(el)
      this.$message.show('已成功复制到剪贴板')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-copy {
  color: $brand-primary-color;
}
</style>
