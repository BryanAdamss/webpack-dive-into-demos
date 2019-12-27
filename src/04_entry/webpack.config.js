const path = require('path')

module.exports = {
  context: __dirname, // context只做为entry、loader的基础查找路径，不会作用于output
  entry: {
    // 从一个entry point生成依赖图，最终生成一个chunk(bundle)
    main: ['./main.js']
    // 从两个entry point生成依赖图，最终打包到一个chunk(bundle)中；
    // main: ['./main.js', './other.js']
    // 有两个entry point,分别从两个entry point开始生成依赖图，最终分别打包到两个chunk(bundle)中
    // main: ['./main.js'],
    // other: ['./other.js']
  },
  output: {
    path: path.join(__dirname, './dist'), // 必须是绝对路径
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?url=false']
      }
    ]
  }
}
