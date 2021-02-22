<template>
  <div class="login">
    <v-form
      v-if="mode === 'login'"
      class="form"
      :data="value"
      :sending="sending"
      :submit="handleLogin"
    >
      <div class="title">用户登录</div>
      <div style="padding: 2rem">
        <v-input name="name" required label="用户名" :rules="[rule.required]" />
        <v-input name="password" required type="password" label="密码" :rules="[rule.required]" />

        <br />
        <div>
          <v-submit>登录</v-submit>
          <ui-button type="secondary" color="primary" @click="toggleMode('register')">
            注册用户
          </ui-button>
        </div>
      </div>
    </v-form>

    <v-form
      v-if="mode === 'register'"
      class="form"
      :data="value"
      :sending="sending"
      :submit="handleRegister"
    >
      <div class="title">用户注册</div>
      <div style="padding: 2rem">
        <v-input name="name" required label="用户名" :rules="[rule.required]" />
        <v-input name="email" required label="邮箱" :rules="[rule.required, rule.email]" />
        <v-input name="password" required type="password" label="密码" :rules="[rule.required]" />

        <br />
        <div>
          <v-submit>注册</v-submit>
          <ui-button type="secondary" color="primary" @click="toggleMode('login')">
            已有账号，登录
          </ui-button>
        </div>
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
      mode: 'login',
    }
  },
  methods: {
    toggleMode(mode) {
      this.mode = mode
    },
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
    handleRegister() {
      this.sending = true
      fetch
        .post('/api/user/register', this.value)
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

  button + button {
    margin-left: 0.5rem;
  }
}
</style>
