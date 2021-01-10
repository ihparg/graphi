<template>
  <div ref="root" class="editor"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: {
    language: {
      type: String,
      default: 'json',
    },
    modelValue: String,
  },
  emits: ['update:modelValue', 'error'],
  setup(props, ctx) {
    const root = ref()

    let editor
    onMounted(() => {
      editor = window.ace.edit(root.value, {
        mode: `ace/mode/${props.language}`,
        value: props.modelValue,
      })

      const session = editor.getSession()

      session.on('change', () => {
        ctx.emit('update:modelValue', session.getValue())
      })

      session.on('changeAnnotation', () => {
        const list = session.getAnnotations().filter(l => l.type === 'error')
        ctx.emit('error', list.length > 0)
      })
    })

    onUnmounted(() => {
      editor.destroy()
    })

    return { root }
  },
}
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
}
</style>
