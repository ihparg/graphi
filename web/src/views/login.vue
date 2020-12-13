<template>
  <div class="login">
    <v-form class="form" :data="value" :sending="sending" :submit="handleLogin">
      <div class="title">用户登录</div>
      <div style="padding: 2rem">
        <v-input name="name" label="用户名" :rules="[rule.required]" />
        <v-input name="password" type="password" label="密码" :rules="[rule.required]" />

        <br />
        <v-submit>登录</v-submit>
      </div>
    </v-form>
  </div>
</template>

<script>
import Rule from '@/utils/rule'
import fetch from '@/utils/fetch'
import { setToken } from '@/utils/localStorage'

export default {
  data() {
    return {
      rule: Rule(),
      value: {},
      sending: false,
    }
  },
  methods: {
    handleLogin() {
      this.sending = true
      fetch
        .post('/api/user/login', this.value)
        .then(user => {
          setToken(user.token)
          window.location.reload()
        })
        .catch(() => {
          this.sending = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  z-index: 100;
}

.title {
  font-size: 1.125rem;
  padding: 1.2rem 2rem;
  background: #f2f2f2;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
}

.form {
  width: 30rem;
  background: #ffffff;
  margin: 15rem auto auto;
  border: solid 1px rgba(0, 0, 0, 0.1);
}
</style>
