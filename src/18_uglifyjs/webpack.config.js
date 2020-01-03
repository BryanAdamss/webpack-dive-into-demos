// UglifyJsPlugin已经废弃，推荐使用terser-webpack-plugin

const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

module.exports = {
  plugins: [
    // 压缩输出的 JS 代码
    new UglifyJSPlugin({
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false
      }
    })
  ]
}

// 除此之外 Webpack 还提供了一个更简便的方法来接入 UglifyJSPlugin，直接在启动 Webpack 时带上 --optimize-minimize 参数，即 webpack --optimize-minimize， 这样 Webpack 会自动为你注入一个带有默认配置的 UglifyJSPlugin。

// 压缩 CSS使用cssnano,webpack已经内置

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize']
        })
      }
    ]
  }
}
