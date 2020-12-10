<template>
  <div class="container">
    <Field
      :disabled="disabled"
      :value="value"
      :show-comments="true"
      :active="handleClick"
      :schemas="schemas"
      :ref-change="handleRefChange"
      name=""
      path=""
    />

    <FieldEdit
      v-if="active != null"
      :allow-dash="allowDash"
      :data="active.data"
      :name="active.name"
      :names="active.names"
      :schemas="schemas"
      :is-ref="active.isRef"
      :node-type="active.nodeType"
      :types="types"
      :change="handleChange"
      :ref-expandable="true"
    />
  </div>
</template>

<script>
import { getActiveField } from '@/utils/schema'
import { getParentByPath } from '@/utils/route'
import { allTypes } from '@/utils/types'
import Field from '../field/index.vue'
import FieldEdit from '../field/edit.vue'

const types = {
  root: ['object', 'ref'],
  body: ['string', 'integer', 'decimal', 'boolean'],
  all: allTypes,
}

export default {
  components: {
    Field,
    FieldEdit,
  },
  props: {
    allowDash: Boolean,
    disabled: Boolean,
    name: String,
    schemas: Object,
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
    }
  },
  computed: {
    types() {
      if (this.name.endsWith('Body')) return types.all
      return this.active.nodeType === 'root' ? types.root : types.body
    },
  },
  methods: {
    handleClick(path) {
      this.active = getActiveField(path, this.value)
    },
    handleChange(name, newName, value) {
      const { parent } = this.active
      this.active = null

      if (name == null && newName == null && parent) return

      if (parent) {
        if (name !== newName) delete parent.properties[name]
        if (newName) {
          if (parent.type === 'array' || parent.type === 'map') {
            parent.items[0] = value
          } else {
            parent.properties[newName] = value
          }
        }

        this.$emit('input', this.value)
      } else if (value) {
        this.$emit('input', value)
      }
    },
    handleRefChange(path, value) {
      path = path.split('.')
      const name = path.pop()
      const parent = getParentByPath(this.value, path)
      if (!parent.properties) {
        parent.properties = {}
      }
      if (value) parent.properties[name] = value
      else delete parent.properties[name]
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
