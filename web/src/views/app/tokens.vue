<template>
  <v-loading v-if="!tokens" />
  <div v-else class="container">
    <v-fab-add @click="showAddToken = true" />

    <div class="list">
      <v-table :data="tokens" class="table">
        <v-table-col title="描述" name="description" />
        <v-table-col title="创建时间" name="createdAt" />
        <v-table-col v-slot="scope" title="Token">
          <span>{{ formatToken(scope.token) }}</span>
          <v-clipboard :data="'Bearer ' + scope.token" />
        </v-table-col>
        <v-table-col v-slot="row" title="创建人">
          {{ row.createdBy }}
        </v-table-col>

        <v-table-col v-slot="row" width="100px">
          <a href="javascript:;">
            <v-icon name="delete" /> 删除
            <v-confirm @confirm="handleRemove(row)">确定删除这个 token 吗？</v-confirm>
          </a>
        </v-table-col>
      </v-table>
    </div>

    <v-drawer v-if="showAddToken" @close="showAddToken = false">
      <v-form :data="form" :submit="handleCreate">
        <v-input name="description" multi-line label="描述" />

        <br />

        <v-submit :loading="sending" />
      </v-form>
    </v-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fetch from '@/utils/fetch'

export default {
  data() {
    return {
      tokens: null,
      sending: false,
      showAddToken: false,
      form: { aid: this.aid },
    }
  },
  computed: {
    ...mapGetters('app', ['isMaintainer']),
    aid() {
      return this.$route.params.aid
    },
  },
  created() {
    fetch.get(`/api/app/${this.aid}/tokens`).then(res => {
      this.tokens = res
    })
  },
  methods: {
    handleCreate() {
      this.sending = true
      fetch
        .post(`/api/app/${this.aid}/token`, this.form)
        .then(res => {
          this.tokens = res
          this.showAddToken = false
          this.form = { aid: this.aid }
          this.$message.show('创建成功')
        })
        .finally(() => {
          this.sending = false
        })
    },
    handleRemove(row) {
      fetch.delete(`/api/app/${this.aid}/token`, { _id: row._id }).then(() => {
        this.$message.show('删除成功')
        this.tokens = this.tokens.filter(t => t._id !== row._id)
      })
    },
    formatToken(token) {
      return `Bearer ${token.substr(0, 4)}****${token.substr(-4)}`
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
  max-width: 96rem;
  margin: 0 auto;
}
</style>
