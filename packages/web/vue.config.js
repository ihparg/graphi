const { resolve } = require('path')

module.exports = {
  devServer: {
    port: 7000,
    proxy: {
      '^/api': {
        target: 'http://localhost:7001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  lintOnSave: false,
  assetsDir: 'public',
  outputDir: '../../build',
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/ui/styles/imports.scss";',
      },
    },
  },
  chainWebpack: config => {
    // alias 配置
    config.resolve.alias.set('@', resolve('src'))
    // svg-sprite-loader 配置
    config.module.rules.delete('svg')
    config.module
      .rule('svg-smart')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
  },
}
