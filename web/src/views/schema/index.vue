<template>
  <v-loading v-if="!data" />
  <div v-else class="schema-container">
    <router-link v-if="isDeveloper" class="add-button" :to="`/app/${aid}/schema/0`">
      <ui-fab color="primary">
        <v-icon name="add" size="2rem" />
      </ui-fab>
    </router-link>

    <div class="schema-list">
      <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

      <v-table :data="list" @row-click="handleRowClick">
        <v-table-col title="名称" name="name" />
        <v-table-col title="Tag" name="tag" />
        <v-table-col title="最后更改时间" name="updatedAt" />
        <v-table-col v-slot="scope" title="更改人">
          {{ scope.updatedBy && scope.updatedBy.name }}
        </v-table-col>
        <v-table-col title="说明" name="description" />
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import fuzzysearch from 'fuzzysearch'

export default {
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    ...mapGetters('app', ['isDeveloper']),
    ...mapState('schema', ['data']),
    aid() {
      return this.$route.params.aid
    },
    list() {
      const list = Object.values(this.data).sort((a, b) => a.name.localeCompare(b.name))
      if (this.filter) {
        return list.filter(
          d => fuzzysearch(this.filter, d.tag || '') || fuzzysearch(this.filter, d.name),
        )
      }
      return list
    },
  },
  created() {
    this.$store.dispatch('schema/fetchAll', { aid: this.aid })
  },
  methods: {
    handleRowClick(schema) {
      this.$router.push(`/app/${this.aid}/schema/${schema.name}`)
    },
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

.schema-container {
  flex: 1;
}

.schema-list {
  padding: 2rem;
  max-width: 96rem;
  margin: 0 auto;
}
</style>
