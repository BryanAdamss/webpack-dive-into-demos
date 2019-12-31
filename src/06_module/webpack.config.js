const path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, './main.js')
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  // 指定module相关选项
  module: {
    // module的匹配规则
    rules: [
      {
        // 使用test、include、exclude确定当前rule匹配的module
        // 匹配的module使用对应loader进行转换
        // test、include、exclude之间的关系
        // test && include && (!exclude)
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      }
    ]
  }
}
