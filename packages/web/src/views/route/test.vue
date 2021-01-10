<template>
  <div class="uri">
    {{ path }}
  </div>

  <div class="test">
    <div class="request">
      <div v-if="!isEmpty('queryString')" class="block">
        <p>QUERY STRING</p>
        <div>
          <div
            v-for="(p, n) in route.queryString.properties"
            :key="n"
            class="input-item"
            :class="{ required: p.required }"
          >
            <div>{{ n }}</div>
            <ui-textbox :value="queryString[n]" @input="queryString[n] = $event" />
          </div>
        </div>
      </div>

      <div v-if="!isEmpty('routeParams')" class="block">
        <p>ROUTE PARAMS</p>
        <div>
          <div
            v-for="(p, n) in route.routeParams.properties"
            :key="n"
            class="input-item"
            :class="{ required: p.required }"
          >
            <div>{{ n }}</div>
            <ui-textbox :value="routeParams[n]" @input="routeParams[n] = $event" />
          </div>
        </div>
      </div>

      <div v-if="hasBody" class="block">
        <p>REQUEST BODY</p>
        <v-editor
          v-model="requestBody"
          style="height: 15rem; border: solid 1px #ddd;"
          @error="setError('body', $event)"
        />
      </div>

      <div>
        <ui-button
          color="primary"
          :loading="status === 'sending'"
          :disabled="hasError"
          @click="test"
        >
          {{ route.method }}
        </ui-button>
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
      queryString: mock.getValue(route.queryString),
      routeParams: mock.getValue(route.routeParams),
      requestBody: body,
      errors: {},
    }
  },
  computed: {
    path() {
      let url = this.devServer + this.route.path
      if (!this.isEmpty('queryString')) {
        const qs = Object.keys(this.queryString).reduce((q, k) => {
          q.push(`${k}=${this.queryString[k]}`)
          return q
        }, [])
        url += `?${qs.join('&')}`
      }
      if (!this.isEmpty('routeParams')) {
        Object.keys(this.routeParams).forEach(k => {
          url = url.replace(`:${k}`, this.routeParams[k])
        })
      }
      return url
    },
    flattenRoute() {
      return flattenRoute(this.route, Object.values(this.schemas))
    },
    hasBody() {
      const { method, requestBody } = this.flattenRoute
      if (method === 'GET' || !requestBody) return false
      return !isEmpty(requestBody.properties)
    },
    hasError() {
      return !isEmpty(this.errors)
    },
  },
  methods: {
    isEmpty(key) {
      const obj = this.flattenRoute[key]
      if (!obj) return true
      return isEmpty(obj.properties)
    },
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
    setError(key, error) {
      if (error) this.errors[key] = error
      else delete this.errors[key]
    },
  },
}
</script>

<style lang="scss" scoped>
.test {
  display: flex;

  & > div {
    width: 50%;
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

  .block {
    margin-bottom: 1.5rem;

    p {
      color: #999999;
    }

    & > div {
      padding: 1rem 2rem;
      background: #ffffff;
      border: solid 1px #dddddd;
    }

    .input-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      div:first-child {
        width: 14rem;
      }

      div:last-child {
        flex: 1;
        margin: 0;
      }

      &.required div:first-child:after {
        content: '*';
        margin-left: 4px;
        color: #f44336;
      }
    }
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
