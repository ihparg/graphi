<template>
  <label class="search">
    <v-icon name="search" color="rgba(0,0,0,0.8)" />
    <input :value="modelValue" @input="updateValue" />
    <span @click="clearValue">
      <v-icon v-if="!!modelValue" name="close" color="rgba(0,0,0,0.4)" />
    </span>
    <div class="hr" />
  </label>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
    },
    clearValue() {
      this.$emit('update:modelValue', '')
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  display: flex;
  padding: 1rem;

  input {
    display: block;
    flex: 1;
    margin-left: 4px;
    border: 0;
    outline: 0;
    background: transparent;

    &:focus + .hr {
      border-bottom: solid 2px $brand-primary-color;
    }
  }

  .hr {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  }
}

svg path {
  fill: red; // rgba(0,0,0,.4);
}
</style>
