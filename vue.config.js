const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  indexPath: 'html/index.html',
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
  devServer: {
    // port: 8001,
    proxy: {
      '/api': {
        // target: 'http://www.kabutong.top:3001',
        target: 'http://59.62.60.23:8536/api',
        ws: true, // 是否跨域
        // changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
