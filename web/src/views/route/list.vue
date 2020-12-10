<template>
  <div class="list">
    <v-search v-model="filter" />
    <div class="inner">
      <router-link
        v-for="r in filterList"
        :key="r._id"
        :class="['item', activeId === r._id ? 'active' : '']"
        :to="`/app/${aid}/route/${r._id}`"
      >
        <div class="title"><span :class="['status-' + r.status]" />{{ r.title }}</div>
        <div class="path">
          <span class="method" :class="{ get: r.method === 'GET' }">
            {{ r.method }}
          </span>
          {{ r.path }}
        </div>
        <span v-if="r.tag" class="tag" @click.stop.prevent="tagClick(r.tag)">
          {{ r.tag }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import fuzzysearch from 'fuzzysearch'

export default {
  props: {
    activeId: String,
    list: Array,
    aid: String,
  },
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    filterList() {
      const { filter } = this
      if (filter) {
        return this.list.filter(
          d =>
            d.tag === filter ||
            fuzzysearch(filter, d.title.toLowerCase()) ||
            fuzzysearch(filter, d.path.toLowerCase()),
        )
      }
      return this.list
    },
  },
  methods: {
    tagClick(tag) {
      this.filter = tag
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: calc(100vh - 3.5rem);

  &::after {
    content: ' ';
    height: 100%;
    width: 0;
    border-right: solid 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 0;
    top: 0;
  }
}

.inner {
  flex: 1;
  overflow: auto;
}

.item {
  position: relative;
  display: block;
  padding: 1rem;
  cursor: pointer;
  border-bottom: solid 1px rgba(0, 0, 0, 0.05);
  align-items: center;

  .tag {
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    font-size: 0.85rem;
    line-height: 1rem;
    text-align: right;
    color: $brand-primary-color;
  }

  .method {
    // transform: scale(0.8);
    padding: 2px;
    border-radius: 0.5rem;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

.item.active {
  background: $brand-primary-color;
  color: #fff;

  .path,
  .tag {
    color: #fff;
  }
}

.title {
  display: flex;
  align-items: center;

  span {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 4px;
    border-radius: 4px;
    background: #000000;
  }
}

.path {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
