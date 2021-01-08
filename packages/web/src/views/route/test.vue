<template>
  <div class="uri">
    {{ path }}
  </div>

  <div class="test">
    <div class="request">
      <div v-if="hasBody">
        REQUEST BODY
        <textarea v-model="requestBody" />
      </div>

      <div>
        <ui-button color="primary" @click="test">{{ route.method }}</ui-button>
        <span v-if="route.status === 0">
          <v-icon name="info" class="req-status" /> 开发中接口使用的是Mock数据
        </span>
      </div>
    </div>

    <div v-if="status" class="response">
      <v-loading v-if="status === 'sending'" />
      <div v-else>
        <div>STATUS: {{ status }}</div>
        <pre>{{ response }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { flattenRoute } from '@graphi/tools/src/route'
import mock from '@graphi/tools/src/mock'
import { isEmpty } from '@/utils/is'

export default {
  props: {
    devServer: String,
    route: Object,
    schemas: Object,
  },
  data() {
    let body = null
    const route = flattenRoute(this.route, Object.values(this.schemas))
    if (route.requestBody) {
      body = JSON.stringify(mock.getValue(route.requestBody), null, 2)
    }

    return {
      response: null,
      status: null,
      requestBody: body,
    }
  },
  computed: {
    path() {
      return this.devServer + this.route.path
    },
    flattenRoute() {
      return flattenRoute(this.route, Object.values(this.schemas))
    },
    hasBody() {
      const { method, requestBody } = this.flattenRoute
      if (method === 'GET' || !requestBody) return false
      return !isEmpty(requestBody.properties)
    },
  },
  methods: {
    test() {
      const { method, responseBody } = this.flattenRoute
      this.status = 'sending'

      const headers = { 'Content-Type': 'application/json; charset=utf-8' }
      const body = this.hasBody ? this.requestBody : undefined
      fetch(this.path, { method, body, headers })
        .then(res => {
          this.status = res.status
          return res.text()
        })
        .then(res => {
          if (this.status === 200 && responseBody.properties) {
            this.response = JSON.stringify(JSON.parse(res), null, 2)
          } else {
            this.response = res
          }
        })
        .catch(e => {
          this.status = 500
          this.response = e.message
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
  padding: 1.5rem 1.5rem 0;
}

.request {
  .req-status {
    margin-left: 1rem;
    color: #ff9800;
  }
}

.response {
  position: relative;
  min-height: 20rem;

  pre {
    padding: 1rem;
    background: #ffffff;
    border: solid 1px #dddddd;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
