<template>
  <div>
    <div class="tab-headers" :style="headStyle">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['item', activeId === tab.id && 'active']"
        @click="tabActive(tab.id)"
      >
        {{ tab.title }}
      </div>
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    active: String,
    headStyle: Object,
  },
  data() {
    return {
      activeId: this.active,
      tabs: [],
    }
  },
  methods: {
    addTab(tab) {
      this.tabs.push(tab)
      if (this.active) {
        tab.activeId = this.active
      } else if (this.tabs.length === 1) {
        tab.activeId = tab.id
        this.activeId = tab.id
      }
    },
    removeTab(tab) {
      this.tabs = this.tabs.filter(t => t !== tab)
    },
    tabActive(id) {
      this.activeId = id
      this.tabs.forEach(t => {
        t.activeId = id
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-headers {
  display: flex;
}

.item {
  position: relative;
  padding: 1rem;
  cursor: pointer;
}

.active {
  color: $brand-primary-color;
  cursor: default;

  &:after {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 0;
    border-bottom: solid 2px $brand-primary-color;
  }
}
</style>
