<template>
  <List v-if="isReady" :list="routes" :active-id="rid" :aid="aid" />
  <v-tabs
    v-if="isReady && rid"
    :key="rid"
    class="route"
    :head-style="{ borderBottom: 'solid 1px #ddd' }"
  >
    <v-tab title="接口信息">
      <Content
        :key="rid"
        v-model:editable="editable"
        :routes="routes"
        :route="route"
        :schemas="schemas"
        :aid="aid"
        :rid="rid"
      />
    </v-tab>
    <v-tab title="预览" :avariable="!editable && !!devServer">
      <Test v-if="!route.$undone" :route="route" :schemas="schemas" :dev-server="devServer" />
    </v-tab>
  </v-tabs>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import fetch from '@/utils/fetch'
import Content from './content.vue'
import List from './list.vue'
import Test from './test.vue'

export default {
  components: {
    Content,
    List,
    Test,
  },
  data() {
    return {
      devServer: null,
      editable: this.$route.params.rid === '0',
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper']),
    ...mapGetters('route', { routes: 'sortedRoutes' }),
    ...mapState('schema', { schemas: 'data' }),
    route() {
      if (this.rid === '0') return { aid: this.aid }
      return this.routes.find(r => r._id === this.rid)
    },
    aid() {
      return this.$route.params.aid
    },
    rid() {
      return this.$route.params.rid
    },
    isReady() {
      return this.routes && this.schemas
    },
  },
  watch: {
    '$route.params.rid': function(rid) {
      this.editable = rid === '0'
      this.getDetail()
    },
  },
  created() {
    const { aid, rid } = this.$route.params
    this.fetchRoutes({ aid, rid })
    this.fetchSchemas({ aid })
    if (aid !== '0') {
      fetch.get(`/api/app/${aid}/devServer`).then(res => {
        this.devServer = res
      })
    }
    this.getDetail()
  },
  methods: {
    ...mapActions('route', { fetchRoutes: 'fetchList' }),
    ...mapActions('schema', { fetchSchemas: 'fetchAll' }),
    getDetail() {
      if (this.routes && this.route && this.route.$undone) {
        this.$store.dispatch('route/fetchOne', { aid: this.aid, id: this.rid })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.route {
  flex: 1;
  position: relative;
  height: calc(100vh - 3.5rem);
  overflow: auto;
}
</style>
