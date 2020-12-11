<template>
  <v-loading v-if="status === 0" />
  <v-forbidden v-else-if="status === 403" />
  <v-not-found v-else-if="status !== 200" />
  <template v-else>
    <v-nav :routes="routes" />
    <router-view></router-view>
  </template>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapGetters('user', ['isAdmin']),
    ...mapState('app', ['app', 'status']),
    aid() {
      return this.$route.params.aid
    },
    routes() {
      if (this.isAdmin) {
        return [
          { name: 'Schema', path: `/app/0/schema`, icon: 'schema' },
          { name: '接口', path: `/app/0/route`, icon: 'route' },
          { name: '用户', path: '/app/0/users', icon: 'account' },
        ]
      }

      if (this.aid === '0') {
        return [
          { name: 'Schema', path: `/app/0/schema`, icon: 'schema' },
          { name: '接口', path: `/app/0/route`, icon: 'route' },
        ]
      }

      return [
        { name: 'Schema', path: `/app/${this.aid}/schema`, icon: 'schema' },
        { name: '接口', path: `/app/${this.aid}/route`, icon: 'route' },
        { name: '用户', path: `/app/${this.aid}/member`, icon: 'account' },
        { name: '回收站', path: `/app/${this.aid}/recycle`, icon: 'auto-delete' },
      ]
    },
  },
  created() {
    this.$store.dispatch('app/fetchById', this.aid)
  },
}
</script>

<style lang="scss" scoped></style>
