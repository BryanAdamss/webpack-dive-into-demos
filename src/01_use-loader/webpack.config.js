const path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, 'main.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '01_use-loader-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 处理.css结尾的文件
        // 使用loader
        // 多个loader时，从右向左(从数组后面往前面)依次调用
        // 通过css-loader、style-loader将css打包到js中
        // 若想将css从js中提取出来，需要使用extract-text-webpack-plugin
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: false // 是否启用url转换(url(image.png) => require('./image.png'))
            }
          }
        ]
        // loader的options也可以用qs传入
        // use: ['style-loader', 'css-loader?url=false']
        // 也可以在require模块时，使用qs形式，指定处理模块的loader，具体见main.js
        // 使用qs形式较少，建议显式写上options，更清晰
      }
    ]
  }
}
