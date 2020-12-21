<template>
  <div ref="container" class="resolve" :class="{ disabled, focused }" @click="open">
    <div class="label">resolve</div>
    <div class="value">{{ value }}</div>
    <div v-if="isRender" class="panel">
      <div class="type list">
        <a v-for="t in types" :key="t" :class="{ active: t === type }" @click="typeChange(t)">
          {{ t }}
        </a>
      </div>
      <div v-if="funcs" class="func list">
        <v-search v-model="funcFilter" class="search" />
        <a v-for="f in funcs" :key="f" :class="{ active: f === func }" @click="funcChange(f)">
          {{ f }}
        </a>
      </div>
      <div v-if="versions" class="version list">
        <v-loading v-if="versions === 'loading'" size="24" />
        <template v-else>
          <a
            v-for="v in versions"
            :key="v"
            :class="{ active: v === version }"
            @click="versionChange(v)"
          >
            {{ v }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import fuzzysearch from 'fuzzysearch'

export default {
  props: {
    aid: String,
    disabled: Boolean,
    resolves: Object,
    value: String,
  },
  emits: ['input'],
  data() {
    // eslint-disable-next-line prefer-const
    let [type, func, version] = (this.value || '').split(/[:@]/)

    const types = Object.keys(this.resolves)
    if (!this.value && types.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      type = types[0]
    }

    return {
      funcFilter: '',
      focused: false,
      isRender: false,
      type,
      types,
      func,
      version,
    }
  },
  computed: {
    funcs() {
      if (!this.type) return null
      let funcs
      const fs = this.resolves[this.type]
      if (Array.isArray(fs)) funcs = fs
      else funcs = Object.keys(fs)

      return funcs.filter(f => fuzzysearch(this.funcFilter, f)).sort()
    },
    versions() {
      if (!this.func) return null
      this.$store.dispatch('route/fetchVersions', { type: this.type, func: this.func })
      return this.resolves[this.type][this.func]
    },
    formatValue() {
      return `${this.type}:${this.func}${this.version ? `@${this.version}` : ''}`
    },
  },
  beforeUnmount() {
    this.removeClickEvent()
  },
  methods: {
    close(e) {
      if (e && this.$refs.container.contains(e.target)) return
      this.focused = false
      this.removeClickEvent()
    },
    open() {
      if (this.disabled) return
      this.focused = true
      this.isRender = true
      document.addEventListener('click', this.close, { passive: true })
    },
    removeClickEvent() {
      document.removeEventListener('click', this.close)
    },
    typeChange(type) {
      this.type = type
      this.func = undefined
      this.version = undefined
    },
    setValue() {
      setTimeout(() => {
        this.close()
        this.$emit('input', this.formatValue)
      }, 100)
    },
    funcChange(func) {
      this.func = func
      this.version = undefined
      if (Array.isArray(this.resolves[this.type])) {
        this.setValue()
      }
    },
    versionChange(version) {
      this.version = version
      this.setValue()
    },
  },
}
</script>

<style lang="scss" scoped>
.resolve {
  position: relative;
  margin-left: 1rem;

  &:hover:not(.disabled) {
    .label {
      color: $ui-input-label-color--hover;
    }
    .value {
      border-bottom-color: $ui-input-label-color--hover;
    }
  }

  &.focused:not(.disabled) {
    .label {
      color: $ui-input-label-color--active;
    }
    .value {
      border-bottom-color: $ui-input-border-color--active;
      border-bottom-width: $ui-input-border-width--active;
    }
    .panel {
      display: flex;
    }
  }
}

.label {
  color: rgba(0, 0, 0, 0.54);
  cursor: default;
  font-size: 0.9375rem;
  line-height: normal;
  margin-bottom: 0;
  transform-origin: left;
  transition: color 0.1s ease, transform 0.2s ease;
}

.value {
  height: 2rem;
  line-height: 1;
  align-items: center;
  border: none;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: 1rem;
  font-weight: normal;
  min-height: 2rem;
  padding: 0;
  transition: border 0.1s ease;
  user-select: none;
  width: 100%;
}

.disabled .value {
  border-bottom-style: dotted;
  border-bottom-width: 2px;
}

.panel {
  position: absolute;
  display: none;
  right: 0;
  width: 40rem;
  height: 16rem;
  background: #fff;
  z-index: 20;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.list {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-right: solid 1px #eee;

  &:hover {
    overflow-y: auto;
  }

  a {
    cursor: pointer;
    display: block;
    padding: 4px 8px;
  }

  .active {
    color: #fff;
    background: $brand-primary-color;
  }
}

.type {
  width: 8rem;
}

.func {
  flex: 1;
}

.search {
  position: sticky;
  top: 0;
  padding: 4px 8px;
  background: #ffffff;
}

.version {
  width: 8rem;
}
</style>