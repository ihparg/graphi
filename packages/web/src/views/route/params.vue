<template>
  <div class="container">
    <Field
      v-for="(f, n) in value.properties"
      :key="n"
      :disabled="disabled"
      :value="f"
      :show-comments="true"
      :active="handleClick"
      :schemas="{}"
      :name="n"
      :path="n"
    />

    <FieldEdit
      v-if="active != null"
      :data="active.data"
      :name="active.name"
      :names="[]"
      :schemas="{}"
      node-type="params"
      :types="types"
      :change="handleChange"
    />
  </div>
</template>

<script>
import Field from '../field/index.vue'
import FieldEdit from '../field/edit.vue'

export default {
  components: {
    Field,
    FieldEdit,
  },
  props: {
    disabled: Boolean,
    name: String,
    type: String,
    value: {
      type: Object,
      default: () => ({ type: 'object', properties: {} }),
    },
  },
  emits: ['input'],
  data() {
    return {
      active: null,
      types: ['string', 'integer', 'decimal', 'boolean'],
    }
  },
  methods: {
    handleClick(path) {
      console.log(path)
      this.active = {
        name: path,
        data: this.value.properties[path],
      }
    },
    handleChange(name, newName, value) {
      this.active = null

      if (name == null && newName == null) return

      // eslint-disable-next-line vue/no-mutating-props
      this.value.properties[name] = value

      this.$emit('input', this.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1rem 2rem;
  background: #f8f8f8;
}
</style>
