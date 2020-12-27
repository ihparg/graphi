<template>
  <div v-if="value">
    <div v-if="isMissed" class="node error" @click="handleRemove">
      {{ name }}: is removed from schemas.
    </div>

    <div
      v-else
      :class="[
        'node',
        !disabled && 'editable',
        value.required && 'required',
        value.$ref && 'is-ref',
        !value.$checked && 'not-checked',
      ]"
      @click="handleClick('')"
    >
      <a
        v-if="false && isExpandable && disabled && value.properties && value.$checked !== false"
        :class="['toggle', collapsed && 'toggle-collapsed']"
        @click.stop="toggle"
      >
        <v-icon name="arrow" size="1rem" />
      </a>
      <a v-if="value.$ref" @click.stop="handleCheck">
        <v-icon
          class="ref-checkbox"
          :name="value.$checked ? 'checkbox' : 'checkbox-blank'"
          size="1rem"
        />
      </a>
      <span v-if="!!name" class="name">{{ name }}:</span>
      <span v-if="value.ref && value.ref.indexOf('.') < 0" class="ref-name">
        &lt;{{ value.ref }}&gt;
      </span>
      <span :class="value.type">{{ text }}</span>
      <span v-if="comma && path && realValue.type !== 'array' && !isExpandable">
        ,
      </span>
      <span v-if="lockRef && value.index" class="index">&lt;Index&gt;</span>
      <span class="comment">{{ extra }}</span>
    </div>
    <div class="list">
      <div v-if="childrenVisible" :style="{ display: collapsed ? 'none' : 'block' }">
        <field
          v-for="(f, n) in children"
          :key="n"
          :active="active"
          :disabled="disabled"
          :name="getItemName(n)"
          :value="f"
          :comma="comma"
          :schemas="schemas"
          :path="`${path}.${n}`"
          :show-comments="showComments"
          :lock-ref="lockRef"
          :ref-change="refChange"
          :is-item="
            (realValue.type === 'array' || realValue.type === 'map') && value.type === 'ref'
          "
        />
        <add-button
          v-if="isExpandable && !disabled && realValue.type !== 'map' && value.$checked !== false"
          :click="() => active(path + '.')"
        />
      </div>
      <div
        v-if="collapsed || (isExpandable && value.$checked === false)"
        class="collapsed"
        @click="toggle"
      >
        ...
      </div>
    </div>
    <div v-if="isExpandable">}<span v-if="!isRoot">,</span></div>
    <div v-if="realValue.type === 'array'">]<span v-if="!isRoot">,</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mock } from '@graphi/mockjs'
import { sortByKey } from '@/utils/objects'
import { getFlattenedProps, getSubField } from '@/utils/schema'
import AddButton from './add-button.vue'

export default {
  name: 'Field',
  components: {
    AddButton,
  },
  props: {
    active: Function,
    comma: { type: Boolean, default: true },
    disabled: Boolean,
    lockRef: Boolean,
    isSchema: Boolean,
    name: String,
    path: String,
    refChange: Function,
    schemas: Object,
    showComments: Boolean,
    value: { type: Object, default: () => ({ type: 'object', properties: {} }) },
    isItem: Boolean,
  },
  data() {
    return {
      collapsed: false,
    }
  },
  computed: {
    ...mapGetters('schema', ['flattenedSchemas']),
    isMissed() {
      const { ref } = this.value
      return ref && !(ref in this.flattenedSchemas)
    },
    realValue() {
      const value = getFlattenedProps(this.value, this.flattenedSchemas)
      return value
    },
    isRoot() {
      return this.name === '' && this.path === ''
    },
    text() {
      const props = this.realValue
      const example = props.exampleValue ? mock(props.exampleValue) : null
      const value = example || props.defaultValue
      switch (props.type) {
        case 'array':
          return '['
        case 'object':
        case 'ref':
        case 'datatable':
        case 'map':
          return this.isExpandable ? '{' : ''
        case 'boolean':
          return value || mock('@boolean')
        case 'datetime':
          return `"${value || mock('@datetime')}"` // '"2000-01-01 00:00:00"'
        case 'integer':
          return value || 0
        case 'decimal':
        case 'double':
          return value || '0.0'
        case 'biginteger':
          return `${value || 0}L`
        case 'json':
          return '{}'
        case 'uuid':
          return `"${mock('@id')}"`
        case 'blob':
          return 'blob'
        default:
          return `"${value || ''}"`
      }
    },
    children() {
      const { properties = {}, type, items } = this.value
      let { ref } = this.value
      if (type === 'object') return sortByKey(properties)

      const refField = this.flattenedSchemas[ref]

      if (type === 'array' || type === 'map') {
        return items
      }

      if (refField.items) return refField.items

      let fields = {}
      if (refField.type === 'ref') {
        const rr = this.flattenedSchemas[refField.ref]
        fields = rr.items ? rr.items : rr.properties
        ref = refField.ref
      } else if (refField.properties) {
        fields = refField.properties
      }

      let newChildren = {}
      if (this.disabled) {
        Object.keys(properties)
          .sort()
          .forEach(k => {
            if (fields[k]) newChildren[k] = { ...fields[k], ...properties[k] }
            else newChildren[k] = properties[k]
          })
      } else if (Array.isArray(fields)) {
        newChildren = fields
      } else {
        Object.keys(fields)
          .sort()
          .forEach(k => {
            const field = fields[k]
            newChildren[k] = {
              ...field,
              $ref: `${ref}.${k}`,
              $checked: !!properties[k],
              ...(properties[k] || {}),
            }
          })
        Object.keys(properties)
          .sort()
          .forEach(k => {
            if (!(k in newChildren)) {
              newChildren[k] = properties[k]
            }
          })
      }
      return sortByKey(newChildren)
    },
    extra() {
      if (!this.showComments) return ''
      const props = this.realValue
      const txt = []
      const { description, min, max, maxLength, minLength } = props
      if (min || max) txt.push(`值范围: [${min || ''}, ${max || ''}]`)
      if (minLength || maxLength) txt.push(`长度范围: [${minLength || ''}, ${maxLength || ''}]`)
      if (props.enum) {
        txt.push(
          `选项: [${props.enum
            .map(e => `${e.value}${e.text == null ? '' : `: ${e.text}`}`)
            .join(', ')}]`,
        )
      }
      if (description) txt.push(description)
      if (txt.length === 0) return ''
      return `// ${txt.join('; ')}`
    },
    isExpandable() {
      const { type } = this.lockRef ? this.value : this.realValue
      if (this.lockRef && type === 'ref') return false
      if (type === 'object' || type === 'map') return true
      if (type !== 'ref') return false
      return true
    },
    childrenVisible() {
      if (this.value.$checked === false) return false
      return this.isExpandable || this.realValue.type === 'array'
    },
  },
  methods: {
    handleClick(p) {
      if (this.disabled) return
      if (this.value.$ref && !this.value.$checked) return
      if (this.isItem && !this.lockRef) return
      this.active(this.path + p)
    },
    handleRemove() {
      if (this.disabled) return
      if (this.refChange) this.refChange(this.path)
    },
    handleCheck() {
      const newValue = this.value.$checked
        ? null
        : { required: this.value.required, ref: this.value.$ref }
      const field = this.flattenedSchemas[this.value.$ref]
      if (newValue) {
        if (field.type === 'object' || field.type === 'ref') {
          newValue.properties = {}
        }
        if (field.type === 'ref') {
          const schema = this.flattenedSchemas[field.ref].properties
          if (schema) {
            Object.keys(schema).forEach(f => {
              if (!['ref', 'object', 'array'].includes(schema[f].type))
                newValue.properties[f] = { ref: `${field.ref}.${f}` }
            })
          }
        } else if (field.type === 'array' || field.type === 'map') {
          newValue.items = [getSubField(field, this.value.$ref, this.flattenedSchemas)]
        } else if (field.properties) {
          newValue.ref = this.value.$ref
          newValue.type = 'ref'
          /*
          Object.keys(field.properties).forEach(k => {
            if (!['ref', 'object'].includes(field.properties[k].type)) {
              newValue.properties[k] = {
                required: field.properties[k].required,
                ref: `${newValue.ref}`,
              }
            }
          })
          */
        }
      }
      this.refChange(this.path, newValue)
    },
    toggle() {
      this.collapsed = !this.collapsed
    },
    getItemName(name) {
      switch (this.realValue.type) {
        case 'array':
          return ''
        case 'map':
          return '[ * ]'
        default:
          return `${name}`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.string,
.datetime {
  color: #42b983;
}

.biginteger,
.integer,
.decimal,
.number,
.double {
  color: #2973b7;
}

.boolean {
  color: #a32eff;
}

.node {
  position: relative;
  display: flex;
  margin-bottom: 4px;

  &.editable {
    cursor: pointer;
  }

  &.required:before {
    content: '*';
    color: #f44336;
    position: absolute;
    right: 100%;
    top: 2px;
    margin-right: 4px;
  }
}

.error {
  color: red;
  cursor: pointer;
}

.ref-name {
  margin-right: 8px;
  color: #486491;
}

.ref-checkbox {
  margin-right: 2px;
  color: #555;
}

.is-ref.not-checked {
  .name {
    color: #999999;
    text-decoration: line-through;
  }
}

.toggle {
  margin-left: -4px;
  transition: transform 0.5s;

  &.toggle-collapsed {
    transform: rotate(-90deg);
  }
}

.collapsed {
  cursor: pointer;

  &:hover {
    color: $brand-primary-color;
  }
}

.name {
  margin-right: 0.5rem;
}

.index {
  color: $brand-primary-color;
  margin-left: 1rem;
}

.editable:hover .name {
  color: $brand-primary-color;
}

.comment {
  color: #999;
  flex: 1;
  padding-left: 1rem;
}

.list {
  position: relative;
  padding-left: 2rem;

  &:before {
    content: ' ';
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 4px;
    border-left: dashed 1px rgba(0, 0, 0, 0.15);
  }
}
</style>
