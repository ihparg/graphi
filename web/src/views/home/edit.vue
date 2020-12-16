<template>
  <v-drawer width="30rem" @close="handleClose">
    <v-form :data="value">
      <v-input name="name" label="应用名称" :rules="[rule.required, rule.min(2)]" />

      <v-input name="description" label="应用描述" multi-line />

      <v-input
        name="visibility"
        type="select"
        label="权限"
        style="width: 15rem"
        :default-value="1"
        :options="visibility"
      />

      <div style="margin-top: 2rem;">
        <v-submit @submit="handleSubmit">提交</v-submit>
        <ui-button style="margin-left: 1rem;" @click="handleClose">取消</ui-button>
      </div>
    </v-form>
  </v-drawer>
</template>

<script>
import { fastClone } from '@/utils/clone'
import fetch from '@/utils/fetch'
import Rule from '@/utils/rule'

export default {
  props: {
    data: Object,
  },
  emits: ['close'],
  data() {
    return {
      value: fastClone(this.data),
      visibility: [
        { label: '私有', value: 0 },
        { label: '内部', value: 1 },
        { label: '公开', value: 2 },
      ],
      rule: Rule(),
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      fetch.post('/api/app', this.value).then(id => {
        this.$message.show('应用创建成功，创建一个数据结构吧')
        this.$router.push(`/app/${id}/schema/0`)
      })
    },
  },
}
</script>

<style></style>
