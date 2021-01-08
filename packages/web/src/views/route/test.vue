<template>
  <div class="uri">
    {{ path }}
  </div>

  <div class="test">
    <div class="request">
      <ui-button color="primary" @click="test">{{ route.method }}</ui-button>
    </div>

    <div v-if="status" class="response">
      <v-loading v-if="status === 'sending'" />
      <div v-else>
        <div>Status: {{ status }}</div>
        <pre>{{ response }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    devServer: String,
    route: Object,
  },
  data() {
    return {
      response: null,
      status: null,
    }
  },
  computed: {
    path() {
      return this.devServer + this.route.path
    },
  },
  methods: {
    test() {
      const { method, responseBody } = this.route
      this.status = 'sending'

      fetch(this.path, { method })
        .then(res => {
          this.status = res.status
          return responseBody.properties ? res.json() : res.text()
        })
        .then(res => {
          this.response = JSON.stringify(res, null, 2)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.test {
  display: flex;

  & > div {
    flex: 1;
    padding: 1rem 1.5rem;
  }
}

.uri {
  padding: 1rem 1.5rem;
}

.request {
}

.response {
  position: relative;
  min-height: 20rem;

  pre {
    padding: 1rem;
    background: #ffffff;
    border: solid 1px #dddddd;
  }
}
</style>
