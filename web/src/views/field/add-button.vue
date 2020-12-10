<template>
  <a class="add-field" @click="click"> <v-icon name="add" size="1rem" /> ADD FIELD </a>
</template>

<script>
export default {
  props: {
    click: Function,
  },
}
</script>

<style lang="scss" scoped>
.add-field,
.add-field:hover {
  color: #d500f9;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.add-field:hover {
  text-decoration: underline;
}
</style>
