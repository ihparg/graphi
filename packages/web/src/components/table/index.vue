<template>
  <table class="table">
    <colgroup>
      <slot />
    </colgroup>
    <thead>
      <tr>
        <th v-for="c in columns" :key="c.$id">{{ c.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(r, i) in data"
        :key="r[rowkey] || i"
        :class="{ 'has-event': hasRowClick }"
        @click="rowClick(r)"
      >
        <v-td v-for="c in columns" :key="c.$id" :column="c" :data="r" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import { provide, reactive } from 'vue'
import { TABLE_SYMBOL } from './data'
import VTd from './td'

export default {
  components: {
    VTd,
  },
  props: {
    data: Array,
    rowkey: {
      type: String,
      default: '_id',
    },
  },
  setup() {
    const columns = reactive([])
    provide(TABLE_SYMBOL, columns)

    return { columns }
  },
  computed: {
    hasRowClick() {
      return !!this.$attrs.onRowClick
    },
  },
  methods: {
    rowClick(row) {
      // 不要申明 emit，否则 this.$attrs.onRowClick  取不到值
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit('row-click', row)
    },
  },
}
</script>

<style lang="scss" scoped>
.table {
  background-color: #fff;
  overflow-x: auto;
  min-width: 100%;
  border: 0;
  white-space: nowrap;
  border-collapse: collapse;
  table-layout: fixed;
  color: rgba(0, 0, 0, 0.87);

  th,
  td {
    text-align: left;
    padding: 1rem;
  }

  tr {
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }

  .has-event {
    cursor: pointer;
  }
}
</style>
