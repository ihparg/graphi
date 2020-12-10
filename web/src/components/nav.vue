<template>
  <div class="nav">
    <div class="inner">
      <router-link
        v-for="item in routes"
        :key="item.name"
        :class="itemClasses(item.path)"
        :to="item.path"
      >
        <v-icon :name="item.icon" />
        <span class="text">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routes: Array,
  },
  methods: {
    itemClasses(path) {
      const classes = ['item']
      if (this.$route.path.startsWith(path)) classes.push('actived')
      return classes
    },
  },
}
</script>

<style lang="scss" scoped>
.nav {
  position: relative;
  width: 3.5rem;
  overflow: hidden;
  min-height: calc(100vh - 3.5rem);

  &:hover {
    overflow: visible;

    .text {
      display: block;
    }
  }
}

.inner {
  z-index: 10;
  height: 100%;
  min-width: 12rem;
  position: absolute;
  top: 0;
  bottom: 0;
  display: inline-block;
  background-color: #333333;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);

  a {
    color: #aaaaaa;
  }
}

.item {
  display: flex;
  padding: 1rem;
  text-decoration: none;
  align-items: center;

  &.actived {
    background-color: #212121;
    font-weight: 600;
    color: #ffffff;
  }
}

.text {
  display: none;
  padding: 0 0.5rem;
}
</style>
