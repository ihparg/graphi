<template>
  <List v-if="data" :list="list" :active-id="name" :aid="aid" />
  <Content
    v-if="!!name && data"
    :key="name"
    v-model:editable="editable"
    :schemas="data"
    :aid="aid"
    :name="name"
  />

  <router-link v-if="!editable" class="add-button" :to="`/app/${aid}/schema/0`">
    <ui-fab color="primary">
      <v-icon name="add" size="2rem" />
    </ui-fab>
  </router-link>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import List from './list.vue'
import Content from './content.vue'

export default {
  components: {
    Content,
    List,
  },
  data() {
    return {
      editable: this.$route.params.name === '0',
    }
  },
  computed: {
    ...mapState('schema', ['data']),
    aid() {
      return this.$route.params.aid
    },
    name() {
      return this.$route.params.name
    },
    list() {
      return Object.values(this.data).sort((a, b) => a.name.localeCompare(b.name))
    },
  },
  watch: {
    '$route.params.name': function(name) {
      this.editable = name === '0'
    },
  },
  created() {
    this.fetchAll({
      aid: this.aid,
    })
  },
  methods: {
    ...mapActions('schema', ['fetchAll']),
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
