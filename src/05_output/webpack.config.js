const path = require('path')

module.exports = {
  entry: {
    app: path.join(__dirname, './main.js')
  },
  output: {
    path: path.join(__dirname, './dist'),
    // name为entry中指定的chunk(bundle) name、若entry未指定chunk(bundle) name则使用main为name
    filename: '[name].bundles.js',
    // entry中未指定name的chunk(异步导入的chunk)命名规则，默认[name]为chunk id；
    // 若使用magic comment，则使用magic comment中指定的name
    chunkFilename: '[name].bundle.js'
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
