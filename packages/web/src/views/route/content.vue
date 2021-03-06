<template>
  <div v-if="value === undefined">
    <v-not-found />
  </div>
  <div v-else class="route-content">
    <v-loading v-if="value.$undone" />
    <v-form v-else :key="editable" ref="form" :data="value" :disabled="!editable">
      <div class="form">
        <div style="display: flex;">
          <v-input
            name="title"
            label="接口名称"
            :rules="[rule.required]"
            required
            style="flex: 1; margin-right: 1rem;"
          />

          <v-input
            name="method"
            label="Method"
            required
            type="select"
            style="width: 10rem; margin-right: 1rem;"
            default-value="GET"
            :options="['GET', 'POST', 'PUT', 'DELETE']"
          />

          <v-input
            name="tag"
            label="Tag"
            type="autocomplete"
            :suggestions="groups"
            default-value=""
            style="width: 15rem;"
          />
        </div>

        <div style="display: flex;">
          <v-input
            name="path"
            label="路径"
            required
            :rules="[rule.required, rule.path, rule.pathExist]"
            style="flex: 1;"
            help="以 / 开头，不要包含域名"
            @input="pathChange"
          />

          <v-input v-if="resolves" :resolves="resolves" :aid="aid" name="resolve" type="resolve" />
        </div>

        <v-tabs v-for="(tab, i) in tabs" :key="i" style="margin-bottom: 1rem;">
          <v-tab
            v-for="(opt, name) in tab"
            :key="name"
            :title="`${opt.title}(${propertiesLength[name]})`"
            :avariable="editable || propertiesLength[name] > 0"
          >
            <v-input
              :name="name"
              :schemas="schemas"
              :allow-dash="opt.allowDash"
              :type="opt.type || 'route-fields'"
              :default-value="{ type: 'object', properties: {} }"
            />
          </v-tab>
        </v-tabs>
      </div>

      <div v-if="!isGuest" class="foot">
        <template v-if="editable">
          <v-submit :loading="sending" @submit="handleSave">
            保存
          </v-submit>

          <ui-button
            v-if="rid !== '0'"
            button-type="button"
            :disabled="sending"
            @click="setEditable(false)"
          >
            取消
          </ui-button>

          <ui-button v-if="isMaintainer && rid !== '0'" class="btn-remove" :disabled="sending">
            删除
            <v-confirm v-if="!sending" @confirm="handleRemove">
              确定删除?
            </v-confirm>
          </ui-button>
        </template>
        <template v-else>
          <ui-button
            v-if="isDeveloper"
            :disabled="sending"
            button-type="button"
            @click="setEditable(true)"
          >
            编辑
          </ui-button>

          <ui-button
            v-if="isShowProcessButton"
            :loading="sending"
            :color="value.status === 0 ? 'orange' : 'green'"
            button-type="button"
            @click="handleProcess"
          >
            {{ value.status === 0 ? '开发完成' : '测试通过' }}
          </ui-button>
        </template>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Rule from '@/utils/rule'
import { getRouteParamsKeys, getAllRefs } from '@/utils/route'
import { fastClone } from '@/utils/clone'
import fetch from '@/utils/fetch'
import { registerInput } from '@/components/form'
import Fields from './fields.vue'
import Params from './params.vue'
import Rosolve from './resolve.vue'

registerInput('route-fields', Fields)
registerInput('route-params', Params)
registerInput('resolve', Rosolve)

export default {
  props: {
    aid: String,
    editable: Boolean,
    rid: String,
    route: Object,
    routes: Object,
    schemas: Object,
  },
  emits: ['update:editable'],
  data() {
    const groups = {}
    const { rid } = this
    const existedPath = {}
    // let route = { aid, $undone: rid !== '0' ? true : undefined }
    this.routes.forEach(r => {
      if (r.tag) groups[r.tag] = true
      if (rid !== r._id) existedPath[r.fullPath] = true
      // else route = r
    })

    return {
      sending: false,
      errors: {},
      existedPath,
      groups: Object.keys(groups),
      rule: Rule({
        pathExist: (value, f, callback) => {
          const fullPath = `${f.method}:${value}`
          if (fullPath in this.existedPath) callback(new Error('路径已存在'))
          else callback(true)
        },
        path: { regExp: '^/[A-Za-z0-9-_:/]+$', message: '不是一个正确的Url' },
      }),
      tabs: [
        {
          requestBody: { title: 'REQUEST BODY' },
          routeParams: { title: 'ROUTE PARAMS', type: 'route-params' },
          queryString: { title: 'QUERY STRING' },
          requestHeaders: { title: 'REQUEST HEADERS', allowDash: true },
        },
        {
          responseBody: { title: 'RESPONSE BODY' },
          responseHeaders: { title: 'RESPONSE HEADERS', allowDash: true },
        },
      ],
      value: fastClone(this.route),
    }
  },
  computed: {
    ...mapState('route', ['resolves']),
    ...mapGetters('app', ['isDeveloper', 'isMaintainer', 'isTester', 'isGuest']),
    ...mapGetters('schema', ['flattenedSchemas']),
    propertiesLength() {
      const length = {}
      ;[
        'requestBody',
        'routeParams',
        'queryString',
        'requestHeaders',
        'responseBody',
        'responseHeaders',
      ].forEach(key => {
        if (this.value[key]) {
          length[key] = this.value[key].properties
            ? Object.keys(this.value[key].properties).length
            : 1
        } else {
          length[key] = 0
        }
      })
      return length
    },
    isShowProcessButton() {
      if (!this.value.resolve) return false
      if (this.isDeveloper && this.value.status === 0) return true
      if (this.isTester && this.value.status === 1) return true
      return false
    },
  },
  watch: {
    editable(val) {
      if (val === false) this.value = this.cloneRoute()
    },
    routes() {
      this.value = this.cloneRoute()
    },
  },
  methods: {
    checkRefs() {
      const allRefs = getAllRefs(this.value)
      const refs = {}
      for (let i = 0; i < allRefs.length; i++) {
        const ref = allRefs[i]
        // refs 只收集第一层Schema Id
        const id = this.schemas[ref.split('.')[0]]._id
        refs[id] = true

        if (!(ref in this.flattenedSchemas)) {
          this.$message.error(`找不到引用字段${ref}，请检查后再提交`)
          return null
        }
      }

      return refs
    },
    handleSave(data) {
      const refs = this.checkRefs()
      if (!refs) return

      this.sending = true
      data.aid = this.aid
      data.refs = Object.keys(refs)
      fetch
        .post(`/api/route/${this.aid}/save`, data)
        .then(res => {
          this.$message.show('保存成功')
          this.$store.commit('route/SET_ROUTE', res)
          if (!data._id) this.$router.push(`/app/${this.aid}/route/${res._id}`)
          else this.$emit('update:editable', false)
        })
        .finally(() => {
          this.sending = false
        })
    },
    setEditable(editable) {
      this.$emit('update:editable', editable)
    },
    cloneRoute() {
      // if (this.rid === '0') return { aid: this.aid }
      // return fastClone(this.routes.find(r => r._id === this.rid))
      return fastClone(this.route)
    },
    pathChange(path) {
      const properties = this.value.routeParams ? this.value.routeParams.properties : {}
      const newProps = {}
      const keys = getRouteParamsKeys(path)
      keys.forEach(key => {
        newProps[key] = properties[key] || { type: 'string' }
      })
      this.value.routeParams = { type: 'object', properties: newProps }
    },
    handleProcess() {
      if (!this.checkRefs()) return
      this.sending = true
      fetch
        .post(`/api/route/${this.aid}/process`, { _id: this.rid })
        .then(status => {
          this.$store.commit('route/CHANGE_STATUS', { _id: this.rid, status })
          this.$message.show('操作成功')
        })
        .finally(() => {
          this.sending = false
        })
    },
    handleRemove() {
      this.sending = true
      fetch
        .delete(`/api/route`, { aid: this.aid, _id: this.rid })
        .then(() => {
          this.$router.push(`/app/${this.aid}/route`)
          setTimeout(() => {
            this.$store.commit('route/REMOVE', this.rid)
          })
        })
        .finally(() => {
          this.sending = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.form {
  padding: 1.5rem 1.5rem 5rem;
}

.foot {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 4rem;
  padding: 1rem 1.5rem;
  background: #f2f2f2;
  box-shadow: 2px -1px 5px rgba(0, 0, 0, 0.1);

  button + button {
    margin-left: 1rem;
  }

  .btn-remove {
    float: right;
  }
}
</style>

<style lang="scss">
.route-content {
  .ui-autocomplete.is-disabled .ui-autocomplete__input,
  .ui-textbox.is-disabled .ui-textbox__input,
  .ui-select.is-disabled .ui-select__display {
    color: #000;
  }
}
</style>
