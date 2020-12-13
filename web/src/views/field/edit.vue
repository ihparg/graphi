<template>
  <div class="bg-over" @click.self="bgClick">
    <div class="props">
      <v-form ref="form" :data="value">
        <div class="fields-list">
          <v-input
            v-if="nodeType === ''"
            label="名称"
            name="name"
            required
            :disabled="isRef"
            :rules="[rule.required, rule.name]"
            :autofocus="true"
            help="只允许英文字符，数字，下划线"
          />

          <div class="group">
            <v-input
              v-if="nodeType !== 'root' && nodeType !== 'item'"
              type="checkbox"
              label="必填"
              name="required"
              style="margin-right: 2rem;"
            />

            <v-input
              v-if="showIndex && showProps('index') && nodeType === ''"
              type="checkbox"
              label="索引"
              name="index"
            />
          </div>

          <v-input
            v-if="!isRef"
            type="select"
            name="type"
            label="类型"
            default-value="string"
            :options="types"
            @input="typeChange"
          />

          <v-input
            v-if="value.type === 'ref' && !isRef"
            type="select"
            name="ref"
            label="引用"
            default-value=""
            :rules="[rule.required]"
            :options="refs"
            :has-search="true"
            :filter="refFilter"
            @input="refChange"
          />

          <div v-if="value.type !== 'ref'">
            <div class="group">
              <v-input v-for="(n, k) in lengthProps" :key="k" :name="k" type="number" :label="n" />
            </div>

            <div v-if="showProps('enum')">
              <ui-checkbox :value="isEnum" @change="setEnum">
                枚举
              </ui-checkbox>
              <div v-if="isEnum">
                <div v-for="(e, i) in value.enum" :key="i" class="group">
                  <v-input
                    :name="`enum[${i}].value`"
                    :rules="[rule.required, rule.enumExist]"
                    placeholder="value"
                  />
                  <v-input :name="`enum[${i}].text`" placeholder="text" />
                  <a style="padding-top: 4px;" @click="addEnum(i)">
                    <v-icon name="add-circle-outline" />
                  </a>
                  <a
                    v-if="value.enum.length > 1"
                    style="padding-top: 4px; margin-left: 4px"
                    @click="removeEnum(i)"
                  >
                    <v-icon name="remove-circle-outline" />
                  </a>
                </div>
              </div>
            </div>

            <v-input label="默认值" name="defaultValue" :rules="exampleRules" />

            <v-input label="示例值" name="exampleValue" help="可以用mockjs规则" />
          </div>

          <v-input label="字段描述" name="description" multi-line :rows="1" autosize />
        </div>

        <div style="position: sticky; bottom: 0; background: #fff;">
          <ui-button type="secondary" color="primary" button-type="button" @click="cancel">
            取消
          </ui-button>

          <ui-button v-if="nodeType === ''" type="secondary" button-type="button" color="red">
            删除
            <v-confirm @confirm="remove">
              确定删除这个字段?
            </v-confirm>
          </ui-button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { filterProps } from '@/utils/objects'
import { fastClone } from '@/utils/clone'
import Rule from '@/utils/rule'
import { getProps } from './props'

const nameWithDash = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](-?_?[a-zA-Z0-9])*_?$)/
const nameWithoutDash = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/

export default {
  props: {
    allowDash: Boolean,
    allowMultiple: {
      type: Boolean,
      default: true,
    },
    change: Function,
    data: {
      type: Object,
      default: () => ({
        type: 'string',
      }),
    },
    isRef: Boolean,
    nodeType: String,
    name: String,
    names: Array,
    schemas: {
      type: Object,
      default: () => ({}),
    },
    submit: Function,
    refExpandable: Boolean,
    types: Array,
    showIndex: Boolean,
  },
  data() {
    return {
      value: { ...fastClone(this.data), name: this.name },
      rule: Rule({
        name: value =>
          new Promise((resolve, reject) => {
            const reg = this.allowDash ? nameWithDash : nameWithoutDash
            if (!reg.test(value)) {
              reject(
                new Error(
                  `只允许英文字符开头，数字, "_"${this.allowDash ? ', "-"' : ''} 组成的字符串`,
                ),
              )
            }
            if (this.names.includes(value.toLowerCase()) && this.name !== value) {
              reject(new Error('字段名称已存在.'))
            }
            resolve()
          }),
        bool: value =>
          new Promise((resolve, reject) => {
            if (['true', 'false'].includes(value) || !value) resolve()
            else reject(new Error('Expect "true" or "false"'))
          }),
        enumExist: (value, form) =>
          new Promise((resolve, reject) => {
            const em = form.enum.reduce((e, f) => {
              if (!e[f.value]) e[f.value] = 1
              else e[f.value] += 1
              return e
            }, {})
            if (em[value] > 1) reject(new Error('is existed.'))
            else resolve(true)
          }),
        length2: (value, form, _, { name }) =>
          new Promise((resolve, reject) => {
            if (!value) {
              resolve(true)
              return
            }

            value = parseInt(value, 10)
            let msg
            switch (name) {
              case 'min':
                if (value > form.max) msg = 'Minimum should less than maximum.'
                break
              case 'max':
                if (value < form.min) msg = 'Maximum should greate than minimum.'
                break
              case 'minLength':
                if (value > form.maxLength) msg = 'Min length should less than max length.'
                break
              case 'maxLength':
                if (value < form.minLength) msg = 'Max length should greate than min length.'
                break
              default:
            }
            if (msg) reject(new Error(msg))
            else resolve(true)
          }),
      }),
      refs: Object.values(this.schemas).map(d => d.name),
    }
  },
  computed: {
    exampleRules() {
      const rules = []
      const { type } = this.value
      switch (type) {
        case 'integer':
          rules.push(this.rule.integer)
          break
        case 'decimal':
          rules.push(this.rule.number)
          break
        case 'boolean':
          rules.push(this.rule.bool)
          break
        default:
      }
      return rules
    },
    isEnum() {
      return !!this.value.enum
    },
    lengthProps() {
      const opts = {
        minimum: '最小值',
        maximum: '最大值',
        minLength: '最小长度',
        maxLength: '最大长度',
        minItems: '最少选项',
        maxItems: '最大选项',
      }

      const props = {}
      Object.keys(opts).forEach(key => {
        if (this.showProps(key)) props[key] = opts[key]
      })

      return props
    },
  },
  methods: {
    bgClick() {
      this.$refs.form
        .validate()
        .then(() => {
          const { name, ...value } = this.value
          this.change(this.name, name, value)
        })
        .catch(() => {})
    },
    showProps(type) {
      if (this.isRef) return false
      const props = getProps(this.value.type || 'string')
      return props.includes(type)
    },
    typeChange(type) {
      if (this.data && this.data.type === type) return
      const props = getProps(type)
      filterProps(this.value, props)
      if (type === 'object' || type === 'ref') {
        this.value.properties = {}
      }
      if (type === 'array' || type === 'map') {
        this.value.items = [{ type: 'string' }]
      }
    },
    refChange(ref) {
      if (!this.refExpandable || !ref) return
      this.value.properties = {}
      Object.keys(this.value.properties).forEach(key => {
        delete this.value.properties[key]
      })
      const schema = this.schemas[ref].content
      if (schema.properties) {
        const properties = {}
        Object.keys(schema.properties).forEach(f => {
          if (!['ref', 'array', 'map', 'object'].includes(schema.properties[f].type)) {
            properties[f] = { ref: `${ref}.${f}` }
          }
        })
        this.value.properties = properties
      }
    },
    refFilter(item, query) {
      return item.indexOf(query) >= 0
    },
    setEnum(checked) {
      if (checked) this.value.enum = [{}]
      else delete this.value.enum
    },
    remove() {
      this.change(this.name)
    },
    cancel() {
      this.change()
    },
    addEnum(i) {
      this.value.enum.splice(i + 1, 0, {})
    },
    removeEnum(i) {
      this.value.enum.splice(i, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-over {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.1);
}

.props {
  position: absolute;
  right: 0;
  top: 3.5rem;
  bottom: 0;
  width: 24rem;
  background: #fff;
  box-shadow: $box-shadow;
  overflow: auto;

  & > div {
    padding: 1rem;
  }
}

.fields-list > div {
  margin-bottom: 1.5rem;
}

.group {
  display: flex;

  & > div {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
