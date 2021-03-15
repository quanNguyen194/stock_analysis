module.exports = {
  'publicPath': '/',
  'outputDir': 'dist',
  'lintOnSave': true,
  'transpileDependencies': [
    'vuetify'
  ],
  'productionSourceMap': false,
  'css': {
    'sourceMap': false,
    'loaderOptions': {
      'css': {}
    }
  },
  'parallel': true,
  'pwa': {},
  'devServer': {
    'open': false,
    'host': '0.0.0.0',
    'port': 8080,
    'https': false,
    'hotOnly': false,
    'proxy': {
      '/pai': {
        'target': 'easy-mock',
        'changeOrigin': true,
        'pathRewrite': {
          '^/api': '/'
        }
      },
      '/admin/index': {
        'target': 'http://zlc-dev.helloshi.com/index.php/',
        'changeOrigin': true
      }
    }
  },
  'pluginOptions': {},
  'runtimeCompiler': true
}
