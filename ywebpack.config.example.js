const path = require('path');

module.exports = {
  port: '8080',
  host: '0.0.0.0',
  publicPath: '/',
  path: 'dist-example',
  vendors: ['jquery'],
  entrys: [{
    template: 'example/index.html',
    filename: 'index.html',
    entry: 'example/index.js',
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
