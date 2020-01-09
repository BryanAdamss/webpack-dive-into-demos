const path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, './main.js')
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?url=false']
      }
    ]
  },
  // target 配置项可以让 Webpack 构建出针对不同运行环境的代码。
  // target会影响其他配置，例如resolve.mainFields
  // 当你设置 target:'node' 时，源代码中导入 Node.js 原生模块的语句 require('fs') 将会被保留，fs 模块的内容不会打包进 Chunk 里。
  // 默认web
  target: 'web',
  //  配置 source Map类型，默认false，不生成source map
  devtool: 'source-map',
  // Externals 用来告诉 Webpack 要构建的代码中使用了哪些不用被打包的模块(不用被打包的模块，一般使用cdn来提供)，也就是说这些模版是外部环境提供的，Webpack 在打包时可以忽略它们
  // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)
  // 例如，从 CDN 引入 jQuery，而不是把它打包
  // <script
  //   src="https://code.jquery.com/jquery-3.1.0.js"
  //   integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  //   crossorigin="anonymous">
  // </script>
  // 再按照如下配置，就可以实现从bundle中剔除某些不需要打包的库
  // 一般用在使用了提供了全局变量的库上，例如jquery
  externals: {
    // key为导入语句from后的值(要导入的包)，value为对应的全局变量
    // 这样配置后
    // import $ from 'jquery'在应用中依旧可用
    // ! 本质是把导入语句(import、require)里的 jquery 替换成运行环境里的全局变量 jQuery
    jquery: 'jQuery'
  },
  // 配置项常用于加载本地的 Loader
  resolveLoader: {
    // 去哪个目录下寻找 Loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main']
  }
}
