<template>
  <v-loading v-if="!logs" />
  <div v-else class="container">
    <div class="list">
      <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

      <v-table :data="logs" class="table">
        <v-table-col v-slot="row" title="类型">
          {{ cnames[row.cname] }}
        </v-table-col>
        <v-table-col title="内容" name="content" />
        <v-table-col title="删除时间" name="createdAt" />
        <v-table-col v-slot="row" title="删除人">
          {{ row.deletedBy.name }}
        </v-table-col>
        <v-table-col v-if="isMaintainer" v-slot="row" width="100px">
          <a href="javascript:;">
            <v-icon name="replay" /> 恢复
            <v-confirm @confirm="handleRestore(row._id)">确定恢复这条数据？</v-confirm>
          </a>
        </v-table-col>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fetch from '@/utils/fetch'

export default {
  data() {
    return {
      logs: null,
      filter: '',
      cnames: {
        route: '接口',
        schema: 'Schema',
      },
    }
  },
  computed: {
    ...mapGetters('app', ['isMaintainer']),
    aid() {
      return this.$route.params.aid
    },
  },
  created() {
    fetch.get(`/api/app/${this.aid}/recycle`).then(res => {
      this.logs = res
    })
  },
  methods: {
    handleRestore(_id) {
      fetch.post('/api/app/restore', { _id }).then(() => {
        this.logs = this.logs.filter(l => l._id !== _id)
        this.$message.show('操作成功')
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
  padding: 2rem;
  max-width: 96rem;
  margin: 0 auto;
}
</style>
