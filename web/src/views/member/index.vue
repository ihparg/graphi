<template>
  <div class="member-container">
    <ui-fab
      v-if="isOwner"
      v-auth:comp="0"
      color="primary"
      class="add-button"
      @click="newMember = true"
    >
      <v-icon name="add" size="2rem" />
    </ui-fab>

    <div class="user-list">
      <v-search v-model="filter" style="width: 20rem; margin-bottom: 2rem; padding: 0.5rem 0;" />

      <v-table :data="app.users">
        <v-table-col title="用户">
          <template #default="scope">{{ scope.user.name }} </template>
        </v-table-col>
        <v-table-col title="角色">
          <template #default="scope">{{ roles[scope.role] }} </template>
        </v-table-col>
        <v-table-col title="" width="8rem">
          <template #default="scope">
            <a v-if="isOwner && scope.user._id !== currentUser._id" href="javascript:;">
              <v-icon name="delete" />
              <v-confirm :action="() => handleRemove(scope.user._id)">
                确定从项目里移除这个用户?
              </v-confirm>
            </a>
          </template>
        </v-table-col>
      </v-table>
    </div>
  </div>

  <v-drawer v-if="newMember" @close="handleClose">
    <div style="margin-bottom: 2rem">添加用户</div>
    <v-form>
      <v-input
        name="user"
        required
        :rules="[rule.required]"
        type="member-select"
        :existed-users="existedUsers"
      />

      <v-input name="role" type="select" label="角色" :options="roleOptions" :default-value="4" />

      <v-submit :submit="handleSubmit">提交</v-submit>
    </v-form>
  </v-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Rule from '@/utils/rule'
import fetch from '@/utils/fetch'

export default {
  data() {
    const roles = ['', '管理员', '开发', '测试', '访客']
    const roleOptions = []
    roles.forEach((label, value) => {
      if (label) roleOptions.push({ label, value })
    })

    return {
      newMember: false,
      filter: '',
      roles,
      roleOptions,
      rule: new Rule(),
    }
  },
  computed: {
    ...mapGetters('app', ['isOwner']),
    ...mapState('app', ['app']),
    ...mapState('user', ['currentUser']),
    existedUsers() {
      const users = {}
      this.app.users.forEach(u => {
        users[u.user._id] = u.role
      })
      return users
    },
  },
  methods: {
    handleClose() {
      this.newMember = false
    },
    handleSubmit(data) {
      data.aid = this.app._id
      fetch.post('/api/app/addMemeber', data).then(res => {
        if (res) this.$store.dispatch('app/addMember', data)
        this.newMember = false
      })
    },
    handleRemove(_id) {
      const data = { aid: this.app._id, _id }
      console.log('data', data)
      fetch.post('/api/app/removeMember', data).then(res => {
        if (res) this.$store.dispatch('app/removeMember', _id)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.member-container {
  flex: 1;
  padding: 2rem;
}

.add-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.user-list {
  max-width: 96rem;
  margin: 0 auto;
}
</style>
