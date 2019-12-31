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
  // 开发服务器的相关配置
  // 有些devServer参数可以在cli中指定

  devServer: {
    hot: true, // 启用hmr
    inline: true, // devServer.inline 用于配置是否自动注入这个代理客户端(负责控制页面刷新)到将运行在页面里的 Chunk 里;一般通过CLI来指定--inline
    contentBase: path.join(__dirname, './dist'), // 指定文件根目录
    // 在响应中添加一个header
    headers: {
      'X-foo': 'bar'
    },
    // devServer默认只能本机访问，配置为0.0.0.0，局域网中的其它设备就可以访问你本地的服务
    // 可在host/webpack-dev-server路径下中查看文件的服务位置
    host: '0.0.0.0',
    // 端口，端口被占用时，会自动递增
    port: 8080,
    // gzip，一般都会开启
    compress: true,
    // 编译完成，是否打开浏览器
    open: true
    // devServer.allowedHosts 配置一个白名单列表，只有 HTTP 请求的 HOST 在列表里才正常返回
    // allowedHosts: ['test.com']
    // 启用https，devServer会自动生成证书
    // 若需要使用自己的证书，也可配置https://webpack.docschina.org/configuration/dev-server/#devserver-https
    // https:true

    // --progress CLI专用，显示编译进度
  }
}
