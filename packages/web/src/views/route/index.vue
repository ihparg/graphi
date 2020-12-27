<template>
  <v-loading v-if="!isReady" />
  <template v-else>
    <v-fab-add v-if="isDeveloper" :to="`/app/${aid}/route/0`" />

    <div class="route-list">
      <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

      <v-table :data="routes" @row-click="handleRowClick">
        <v-table-col title="接口名称" name="title" />
        <v-table-col title="方法" name="method" />
        <v-table-col title="路径" name="path" />
        <v-table-col title="Tag" name="tag" />
        <v-table-col title="resolve" name="resolve" />
        <v-table-col v-slot="scope" title="最后修改">
          {{ scope.updatedBy && scope.updatedBy.name }}
        </v-table-col>
        <v-table-col title="修改时间" name="createdAt" />
        <v-table-col v-slot="scope" title="状态">
          {{ status[scope.status] }}
        </v-table-col>
      </v-table>
    </div>
  </template>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import fuzzysearch from 'fuzzysearch'

export default {
  data() {
    return {
      filter: '',
      status: ['开发中', '测试中', '已完成'],
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper']),
    ...mapGetters('route', ['sortedRoutes']),
    ...mapState('schema', { schemas: 'data' }),
    routes() {
      const { filter } = this
      if (!filter) return this.sortedRoutes
      return this.sortedRoutes.filter(route => {
        return route.tag === filter || fuzzysearch(filter, route.title + route.path)
      })
    },
    aid() {
      return this.$route.params.aid
    },
    isReady() {
      return this.routes && this.schemas
    },
  },
  created() {
    const { aid } = this.$route.params
    this.fetchRoutes({ aid })
    this.fetchSchemas({ aid })
  },
  methods: {
    ...mapActions('route', { fetchRoutes: 'fetchList' }),
    ...mapActions('schema', { fetchSchemas: 'fetchAll' }),
    handleRowClick(route) {
      this.$router.push(`/app/${route.aid}/route/${route._id}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.route-list {
  width: 100%;
  padding: 2rem;
}
</style>
