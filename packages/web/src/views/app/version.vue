<template>
  <v-loading v-if="versions == null" />
  <div v-else class="container">
    <v-fab-add @click="showCreate = true" />

    <div class="list">
      <v-table :data="versions" class="table">
        <v-table-col title="版本号" name="tag" />
        <v-table-col title="接口数" name="routeCount" />
        <v-table-col title="描述" name="description" />
        <v-table-col title="创建时间" name="createdAt" />
        <v-table-col v-slot="row" title="创建人">
          {{ row.createdBy }}
        </v-table-col>

        <v-table-col v-slot="row">
          <a href="javascript:;" @click="handleDownload(row.tag)">
            models
          </a>

          <a v-if="isMaintainer && row._id" href="javascript:;">
            <v-icon name="delete" /> 删除
            <v-confirm @confirm="handleRemove(row)">确定删除这个版本吗？</v-confirm>
          </a>
        </v-table-col>
      </v-table>
    </div>

    <v-drawer v-if="showCreate" @close="showCreate = false">
      <v-form :data="form" :submit="handleCreate">
        <v-input
          name="tag"
          label="版本号"
          required
          :rules="[rule.required, rule.tag]"
          help="只允许英文字符，数字，下划线"
        />

        <v-input name="description" multi-line label="描述" />

        <br />

        <v-submit :loading="sending" />
      </v-form>
    </v-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Rule from '@/utils/rule'
import fetch from '@/utils/fetch'

export default {
  data() {
    return {
      form: {},
      sending: false,
      showCreate: false,
      versions: null,
      rule: Rule({
        tag: value =>
          new Promise((resolve, reject) => {
            const reg = /^[a-zA-Z0-9_]+$/
            if (!reg.test(value)) {
              reject(new Error(`只允许英文，数字, "_" 组成的字符串`))
            }
            if (this.tags.includes(value.toLowerCase()) && this.name !== value) {
              reject(new Error('版本号已存在.'))
            }
            resolve()
          }),
      }),
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper', 'isMaintainer']),
    aid() {
      return this.$route.params.aid
    },
    tags() {
      if (this.versions == null) return []
      return this.versions.map(v => v.tag)
    },
  },
  created() {
    fetch.get(`/api/version/${this.aid}`).then(res => {
      res.unshift({ tag: '$latest' })
      this.versions = res
    })
  },
  methods: {
    handleCreate() {
      this.sending = true
      fetch
        .post(`/api/version/${this.aid}/create`, this.form)
        .then(res => {
          this.versions.unshift(res)
          this.showCreate = false
          this.form = {}
          this.$message.show('版本创建成功')
        })
        .finally(() => {
          this.sending = false
        })
    },
    handleRemove(row) {
      fetch.delete(`/api/version/${this.aid}`, { _id: row._id }).then(res => {
        if (res) {
          this.versions = this.versions.filter(v => v._id !== row._id)
          this.$message.show('版本已删除，可以在回收站中恢复')
        }
      })
    },
    handleDownload(tag) {
      fetch.get(`/api/app/${this.aid}/modules?tag=${tag}`).then(res => {
        console.log(res)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
}

.list {
  padding: 4rem 2rem 2rem;
  margin: 0 auto;
}
</style>
