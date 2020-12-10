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
      <tr v-for="(r, i) in data" :key="r[rowkey] || i" @click="rowClick(r)">
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
  emits: ['row-click'],
  setup() {
    const columns = reactive([])
    provide(TABLE_SYMBOL, columns)

    return { columns }
  },
  methods: {
    rowClick(row) {
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
}
</style>
