<template>
  <div v-auth:page="1" class="user-container">
    <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

    <v-fab-add @click="showEdit = true" />

    <v-table :data="list">
      <v-table-col title="用户名" name="name" />
      <v-table-col title="角色">
        <template #default="scope">
          {{ ['普通用户', '管理员'][scope.role] }}
        </template>
      </v-table-col>
      <v-table-col title="创建时间" name="createdAt" />
      <v-table-col title="最后登录时间" name="lastLoginAt" />
      <v-table-col title="状态">
        <template #default="scope">
          {{ ['停用', '正常'][scope.status] }}
        </template>
      </v-table-col>
    </v-table>

    <edit v-if="showEdit" @close="handleClose" />
  </div>
</template>

<script>
import fetch from '@/utils/fetch'
import Edit from './edit.vue'

export default {
  components: {
    Edit,
  },
  data() {
    return {
      filter: '',
      showEdit: false,
      users: [],
    }
  },
  computed: {
    list() {
      if (!this.filter) return this.users
      return this.users.filter(u => u.name.indexOf(this.filter) > -1)
    },
  },
  created() {
    fetch.get('/api/user/all').then(res => {
      this.users = res
    })
  },
  methods: {
    handleClose(data) {
      this.showEdit = false
      if (data) this.users.unshift(data)
    },
  },
}
</script>

<style lang="scss" scoped>
.user-container {
  position: relative;
  flex: 1;
  height: calc(100vh - 3.5rem);
  overflow: auto;
  padding: 2rem;
}
</style>
