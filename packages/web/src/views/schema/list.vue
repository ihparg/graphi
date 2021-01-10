<template>
  <div class="list">
    <v-search v-model="filter" />
    <div class="inner">
      <router-link
        v-for="s in filterList"
        :key="s._id"
        :class="['item', activeId === s.name ? 'active' : '']"
        :to="`/app/${aid}/schema/${s.name}`"
      >
        <div class="text">
          <div class="name">
            <b>{{ s.name }}</b>
          </div>

          <div class="desc">
            {{ s.description }}
          </div>
        </div>

        <span v-if="!!s.tag" class="tag" @click.stop.prevent="handleTagClick(s.tag)">
          {{ s.tag }}
        </span>
      </router-link>
      <div v-if="list.length === 0" class="empty">暂无 Schema</div>
    </div>
  </div>
</template>

<script>
import fuzzysearch from 'fuzzysearch'

export default {
  props: {
    activeId: String,
    aid: String,
    list: Array,
  },
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    filterList() {
      if (this.filter) {
        return this.list.filter(
          d => fuzzysearch(this.filter, d.tag || '') || fuzzysearch(this.filter, d.name),
        )
      }
      return this.list
    },
  },
  methods: {
    handleTagClick(tag) {
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
  width: 24rem;
  height: calc(100vh - 3.5rem);

  // 代替右边线条，消除 active 视觉差
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
  display: flex;
  padding: 1rem;
  cursor: pointer;
  border-bottom: solid 1px rgba(0, 0, 0, 0.05);
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .desc {
    margin-top: 0.5rem;
    color: rgba(0, 0, 0, 0.5);
  }
}

.item.active {
  background: $brand-primary-color;
  color: #fff;

  .desc {
    color: rgba(255, 255, 255, 0.6);
  }

  .tag {
    color: #fff;
  }
}

.text {
  flex: 1;
}

.name {
  display: flex;

  b {
    flex: 1;
  }
}

.tag {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 0.85rem;
  line-height: 1rem;
  text-align: right;
  color: $brand-primary-color;
}

.empty {
  text-align: center;
  padding-top: 2rem;
}
</style>
