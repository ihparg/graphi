<template>
  <v-drawer width="30rem" @close="handleClose">
    <v-form :data="value">
      <v-input name="name" :rules="[rule.required]" label="用户名" />

      <v-input name="password" :rules="[rule.required]" type="password" label="密码" />

      <v-input name="email" :rules="[rule.required, rule.email]" label="邮箱" />

      <v-input name="role" type="select" label="角色" :default-value="0" :options="roles" />

      <v-input
        name="status"
        type="switch"
        label="启用"
        :true-value="1"
        :false-value="0"
        :default-value="1"
      />

      <div style="margin-top: 2rem;">
        <v-submit :submit="handleSubmit">提交</v-submit>
        <ui-button style="margin-left: 1rem;" @click="handleClose">取消</ui-button>
      </div>
    </v-form>
  </v-drawer>
</template>

<script>
import fetch from '@/utils/fetch'
import Rule from '@/utils/rule'

export default {
  emits: ['close'],
  data() {
    return {
      value: {},
      roles: [
        { label: '普通用户', value: 0 },
        { label: '管理员', value: 1 },
      ],
      rule: Rule(),
    }
  },
  methods: {
    handleSubmit(data) {
      fetch.post('/api/user/create', data).then(res => {
        this.$emit('close', res)
      })
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.user-edit-container {
  position: fixed;
  right: 0;
  top: 3.5rem;
  bottom: 0;
  width: 30rem;
  padding: 1.5rem;
  background: #fff;
  box-shadow: $box-shadow;
  overflow: auto;
  z-index: 50;
}
</style>
