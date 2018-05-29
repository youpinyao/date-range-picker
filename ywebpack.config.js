const path = require('path');
// eslint-disable-next-line
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  port: '8080',
  host: '0.0.0.0',
  publicPath: '/',
  path: 'dist',
  vendors: false,
  hash: false,
  entrys: [{
    name: 'picker.min',
    entry: './index.js',
  }],
  cssOptions: undefined,
  lessOptions: undefined,
  sassOptions: undefined,
  extraBabelPresets: [],
  extraBabelPlugins: [],
  webpackMerge: {
    resolve: {
      alias: {
        tpl: path.resolve(__dirname, './node_modules/art-template/lib/template-web.js'),
      },
    },
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
    },
    plugins: [new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true,
    })],
  },
  afterBuild() {
    console.log('afterBuild');
  },
  // 对应环境独立的配置
  development: {},
  // 对应环境独立的配置
  production: {},
  // 如果某些的特定的依赖需要同项目一样构建，正则表达式
  buildInclude: undefined,
};
