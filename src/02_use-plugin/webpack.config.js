const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const resolve = _path => path.resolve(__dirname, _path)

module.exports = {
  entry: {
    main: resolve('./main.js')
  },
  output: {
    path: resolve('./dist'),
    filename: '02_use-plugin-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 调用extract从已有的loader生成一个新的loader
        use: ExtractTextPlugin.extract({
          // 转换 .css 文件需要使用的 Loader
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    // 实例化插件
    new ExtractTextPlugin({
      // 从 .js 文件中提取出来的 .css 文件的名称
      filename: `02_use-plugin.css`
    })
  ]
}
