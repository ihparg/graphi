<template>
  <Login v-if="currentUser === 0" />
  <div v-else-if="currentUser" id="app">
    <div class="header">
      <router-link class="logo" to="/">
        <v-icon name="logo" size="2rem" />
        <span style="font-size: 1.2rem; margin-left: 0.5rem">GRAPHI</span>
      </router-link>

      <div style="flex: 1"></div>

      <div class="userinfo">
        {{ currentUser.name }}
        <div class="user-menu">
          <a href="javascript:;" @click="logout">退出登录</a>
        </div>
      </div>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
  <ui-snackbar-container ref="message" position="right" />
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Login from './views/login.vue'

export default {
  name: 'App',
  components: {
    Login,
  },
  computed: {
    ...mapState('user', ['currentUser']),
  },
  created() {
    this.$store.dispatch('user/fetchCurrentUser')
  },
  mounted() {
    this.$message.bind(() => this.$refs.message)
  },
  methods: {
    ...mapActions('user', ['logout']),
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: 3.5rem;
  background: #212121; //$brand-primary-color;
  display: flex;
  align-items: center;

  .userinfo {
    position: relative;
    padding: 0 2rem;
    height: 3.5rem;
    line-height: 3.5rem;
    color: #ffffff;

    .user-menu {
      position: absolute;
      display: none;
      right: 0;
      top: 100%;
      width: 10rem;
      z-index: 50;
      background: #333333;

      a {
        display: block;
        line-height: 1;
        padding: 1rem 1.5rem;
        color: #aaaaaa;

        &:hover {
          color: #ffffff;
          background: #212121;
        }
      }
    }

    &:hover .user-menu {
      display: block;
    }
  }
}

.logo {
  color: #fff;
  text-decoration: none;
  font-size: 1.4rem;
  margin-left: 1rem;

  * {
    vertical-align: middle;
  }

  #wedge {
    fill: $brand-primary-color;
  }
}

.body {
  display: flex;
  position: relative;
  background-color: #f2f2f2;
  min-height: calc(100vh - 3.5rem);
}
</style>
