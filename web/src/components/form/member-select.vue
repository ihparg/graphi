<template>
  <ui-select
    has-search
    disable-filter
    :label="label"
    :name="name"
    :loading="loading"
    :options="options"
    :style="style"
    :keys="{ label: 'name', value: '_id' }"
    :value="value || undefined"
    :required="required"
    :error="error"
    :invalid="invalid"
    :no-results="options.length === 0"
    @input="handleInputChange"
    @query-change="handleQueryChange"
  />
</template>

<script>
import fuzzysearch from 'fuzzysearch'
import fetch from '@/utils/fetch'

export default {
  inheritAttrs: false,
  props: {
    label: { type: String, default: '用户' },
    name: String,
    required: Boolean,
    style: Object,
    value: [Object, String],
    error: String,
    invalid: Boolean,
    existedUsers: { type: Object, default: () => ({}) },
  },
  emits: ['input'],
  data() {
    return {
      query: '',
      users: [],
      loading: false,
    }
  },
  computed: {
    isInner() {
      return this.$store.state.user.usersCount < 1000
    },
    innerOptions() {
      const { users } = this.$store.state.user
      return users || []
    },
    options() {
      if (this.isInner) {
        return this.innerOptions.filter(u => {
          return !this.existedUsers[u._id] && fuzzysearch(this.query, u.name)
        })
      }
      return this.users.filter(u => !this.existedUsers[u._id])
    },
  },
  created() {
    this.$store.dispatch('user/fetchUsersCount')
  },
  methods: {
    handleQueryChange(query) {
      if (this.isInner) {
        this.query = query
        return
      }
      this.users = []
      if (query) {
        this.loading = true
        fetch.get(`/api/user/list?name=${query}`).then(res => {
          this.users = res
          this.loading = false
        })
      }
    },
    handleInputChange(value) {
      if (!value) return
      this.$emit('input', value)
    },
  },
}
</script>

<style></style>
