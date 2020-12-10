<template>
  <div v-if="schema === undefined && name !== '0'" class="schema-content">
    <v-not-found />
  </div>
  <div v-else class="schema-content">
    <v-form :data="editable ? value : schema" :disabled="!editable">
      <div class="baseinfo">
        <v-input
          name="name"
          required
          label="名称"
          style="width: 20rem;"
          :rules="[
            rule.required,
            rule.name,
            rule.regExp(
              /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/,
              '名称只支持英文，数字和 _ ',
            ),
          ]"
        />
        <v-input
          name="tag"
          label="Tag"
          type="autocomplete"
          :suggestions="groups"
          default-value=""
          style="width: 10rem;"
        />

        <v-input name="description" label="描述" style="flex: 1;" />
      </div>

      <div class="list">
        <div class="field">
          <Field
            :disabled="!editable"
            :value="editable ? value.content : schema.content"
            :lock-ref="true"
            :show-comments="true"
            :schemas="schemas"
            :active="fieldActive"
            :ref-change="handleRefChange"
            name=""
            path=""
          />
        </div>
      </div>

      <div v-if="isDeveloper" class="foot">
        <template v-if="editable">
          <v-submit :submit="handleSubmit">
            保存
          </v-submit>

          <ui-button
            v-if="name !== '0'"
            button-type="button"
            style="margin-left: 1rem;"
            @click="setEditable(false)"
          >
            取消
          </ui-button>
        </template>
        <template v-else>
          <ui-button v-if="isDeveloper" button-type="button" @click="setEditable(true)">
            编辑
          </ui-button>
        </template>
      </div>
    </v-form>

    <FieldEdit
      v-if="active != null"
      :name="active.name"
      :names="active.names"
      :data="active.data"
      :change="handleChange"
      :schemas="schemas"
      :node-type="active.nodeType"
      :allow-dash="true"
      :types="allTypes"
      :show-index="true"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fastClone } from '@/utils/clone'
import { allTypes } from '@/utils/types'
import { getActiveField } from '@/utils/schema'
import Rule from '@/utils/rule'
import Field from '../field/index.vue'
import FieldEdit from '../field/edit.vue'

export default {
  components: {
    Field,
    FieldEdit,
  },
  props: {
    aid: String,
    name: String,
    editable: Boolean,
    schemas: { type: Object, default: () => ({}) },
  },
  emits: ['update:editable'],
  data() {
    const groups = {}
    Object.values(this.schemas).forEach(s => {
      if (s.tag) groups[s.tag] = true
    })

    return {
      allTypes,
      groups: Object.keys(groups),
      rule: new Rule({
        name: (value, form, callback) => {
          if (this.names.includes(value.toLowerCase())) {
            callback(new Error(`${value} 已存在`))
          } else {
            callback(true)
          }
        },
      }),
      active: null,
      value: { aid: this.aid, content: { type: 'object', properties: {} } },
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper', 'isGuest']),
    schema() {
      return this.schemas[this.name]
    },
    names() {
      const name = this.schema && this.schema.name ? this.schema.name.toLowerCase() : ''
      return Object.values(this.schemas)
        .map(s => s.name.toLowerCase())
        .filter(s => s !== name)
    },
  },
  methods: {
    setEditable(editable) {
      if (editable) {
        this.value = fastClone(this.schema)
      }
      this.$emit('update:editable', editable)
    },
    handleChange(name, newName, value) {
      const { parent } = this.active
      this.active = undefined

      if (!name && !newName && parent) return

      if (parent) {
        if (name !== newName) delete parent.properties[name]
        if (newName) {
          if (parent.type === 'array' || parent.type === 'map') {
            parent.items[0] = value
          } else {
            parent.properties[newName] = value
          }
        }
      } else if (value) {
        this.value.content = value
      }
    },
    handleRefChange(path) {
      const field = getActiveField(path, this.value.content, this.schemas)
      delete field.parent.properties[field.name]
    },
    handleSubmit() {
      this.$store.dispatch('schema/save', {
        data: this.value,
        oldName: this.name,
        success: schema => {
          this.$message.show('Schema 保存成功')
          if (schema.name !== this.name) {
            this.$router.push(`/app/${this.aid}/schema/${schema.name}`)
          } else {
            this.$emit('update:editable', false)
          }
        },
      })
    },
    fieldActive(path) {
      if (path == null) {
        this.active = null
        return
      }

      this.active = getActiveField(path, this.value.content, this.schemas)
    },
  },
}
</script>

<style lang="scss" scoped>
.schema-content {
  flex: 1;
  height: calc(100vh - 3.5rem);
  overflow: auto;
}

.baseinfo {
  display: flex;
  padding: 2rem 2rem 0;

  & > * {
    margin-right: 1.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

.list {
  min-height: calc(100vh - 14rem);
  padding: 0 2rem 1rem;
}

.error {
  color: #f44336;
  margin: -0.5rem 0 1rem 1rem;
}

.field {
  padding: 1rem 2rem;
  background: #f8f8f8;
}

.foot {
  position: sticky;
  bottom: 0;
  padding: 1rem 2rem;
  height: 4.2rem;
  background: #f2f2f2;
  box-shadow: $box-shadow;
}

.pop-confirm {
  padding: 1rem;

  .button {
    margin-top: 1rem;
    text-align: right;
  }
}
</style>
