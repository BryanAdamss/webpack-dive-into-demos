// devServer需要使用webpack-dev-server
// 只需要在package.json中执行webpack-dev-server命令
// --hot 开启hmr
// --devtool sourcemap 开启sourcemap
// --config xxx 若webpack配置文件不在process.cwd()目录即当前工作目录中，则需要手动指定位置

const path = require('path')

const resolve = _path => path.resolve(__dirname, _path)

module.exports = {
  entry: {
    path: resolve('./main.js')
  },
  output: {
    path: resolve('./dist'),
    filename: '03_dev-server-bundle.js'
  }
}
