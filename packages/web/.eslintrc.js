const path = require('path')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    '@vue/prettier',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.vue', '.json'],
        map: [['@', path.resolve(__dirname, './src')]],
      },
    },
  },
  rules: {
    'max-len': 0,
    'func-names': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    semi: [2, 'never'],
    'import/no-named-as-default-member': 0,
    'import/no-extraneous-dependencies': 0,
    'vue/no-multiple-template-root': 0,
    'vue/require-default-prop': 0,
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 6,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
}
