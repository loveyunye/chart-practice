const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  indexPath: 'html/index.html',
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.kabutong.top:3001',
        ws: true, // 是否跨域
        changeOrigin: true,
      },
    },
  },
};
