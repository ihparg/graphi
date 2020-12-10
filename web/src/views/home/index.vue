<template>
  <div class="app-container">
    <ui-fab v-auth:comp="0" color="primary" class="add-button" @click="activeId = ''">
      <v-icon name="add" size="2rem" />
    </ui-fab>

    <div class="app-list">
      <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

      <v-table :data="filterList" @row-click="handleRowClick">
        <v-table-col title="应用名称" name="name" />
        <v-table-col title="应用说明" name="description" />
        <v-table-col title="所有者">
          <template #default="scope">
            {{ scope.owner.name }}
          </template>
        </v-table-col>
        <v-table-col title="创建时间" name="createdAt" />
      </v-table>
    </div>

    <app-edit v-if="activeId != null" :data="activeData" @close="handleClose" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fetch from '@/utils/fetch'
import AppEdit from './edit.vue'

export default {
  components: {
    AppEdit,
  },
  data() {
    return {
      appList: [],
      activeId: null,
      filter: '',
    }
  },
  computed: {
    ...mapState('user', { currentUser: 'currentUser' }),
    activeData() {
      const { activeId } = this
      if (activeId === '') return {}
      return this.appList.find(a => a._id === activeId)
    },
    filterList() {
      if (!this.filter) return this.appList
      return this.appList.filter(a => (a.name + a.description).indexOf(this.filter) > -1)
    },
  },
  created() {
    fetch.get('/api/apps').then(res => {
      this.appList = res
    })
  },
  methods: {
    handleClose(id) {
      if (id) {
        fetch.get(`/api/app/${id}`).then(data => {
          this.appList = this.appList.filter(a => a._id === id)
          this.appList.push(data)
        })
      }
      this.activeId = null
    },
    handleRowClick(row) {
      this.$router.push(`/app/${row._id}/route`)
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 2rem 0;
  width: 100%;
}

.add-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.app-list {
  max-width: 96rem;
  margin: 0 auto;
}
</style>
