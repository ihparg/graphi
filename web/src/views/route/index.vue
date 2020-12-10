<template>
  <List v-if="isReady" :list="routes" :active-id="rid" :aid="aid" />
  <Content
    v-if="isReady && rid"
    :key="rid"
    v-model:editable="editable"
    :routes="routes"
    :schemas="schemas"
    :aid="aid"
    :rid="rid"
  />

  <router-link v-if="!editable && isDeveloper" class="add-button" :to="`/app/${aid}/route/0`">
    <ui-fab color="primary">
      <v-icon name="add" size="2rem" />
    </ui-fab>
  </router-link>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Content from './content.vue'
import List from './list.vue'

export default {
  components: {
    Content,
    List,
  },
  data() {
    return {
      editable: this.$route.params.rid === '0',
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper']),
    ...mapGetters('route', { routes: 'sortedRoutes' }),
    ...mapState('schema', { schemas: 'data' }),
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
  },
}
</script>

<style lang="scss" scoped>
.add-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
</style>
