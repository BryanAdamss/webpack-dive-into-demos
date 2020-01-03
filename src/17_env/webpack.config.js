// 注意在定义环境变量的值时用 JSON.stringify 包裹字符串的原因是环境变量的值需要是一个由双引号包裹的字符串，而 JSON.stringify('production')的值正好等于'"production"'。

const DefinePlugin = require('webpack/lib/DefinePlugin')

module.exports = {
  plugins: [
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}

// ! 通过 Shell 脚本的方式去定义的环境变量，例如 NODE_ENV=production webpack，Webpack 是不认识的，对 Webpack 需要处理的代码中的环境区分语句是没有作用的。
// 如果你想让 Webpack 使用通过 Shell 脚本的方式去定义的环境变量，你可以使用 EnvironmentPlugin，代码如下
// https://webpack.docschina.org/plugins/environment-plugin

// new webpack.EnvironmentPlugin(['NODE_ENV'])

// 以上这句代码实际上等价于：

// new webpack.DefinePlugin({
//   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
// })
