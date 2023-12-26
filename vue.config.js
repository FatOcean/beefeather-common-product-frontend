const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  outputDir: 'dist',
  publicPath: './',

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '通用产品'
    }
  },
  devServer: {
    port: 8081,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/beefeather': {
        // https://beefeather-ng-front.lianyirong.com.cn/beefeather/
        target: 'https://beefeather-ng-front.lianyirong.com.cn', // 微服务
        // target: 'https://beefeather-ng-front.hrlyit.com',
        changeOrigin: true,
        pathRewrite: {
          '^/beefeather': '/'
        }
      },
      '/*': {
        target: 'https://beefeather-ng-front.lianyirong.com.cn',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    externals: {
      // pdfjsLib: "pdfjsLib",
      // pdfjsWorker: "pdfjsWorker",
    }
  },

  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
