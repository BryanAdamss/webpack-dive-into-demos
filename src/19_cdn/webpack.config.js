// cnd最佳实践：html文件放在自己不服务器，不缓存；其他静态资源放cdn开启缓存

// 针对 HTML 文件：不开启缓存，把 HTML 放到自己的服务器上，而不是 CDN 服务上，同时关闭自己服务器上的缓存。自己的服务器只提供 HTML 文件和数据接口。
// 针对静态的 JavaScript、CSS、图片等文件：开启 CDN 和缓存，上传到 CDN 服务上去，同时给每个文件名带上由文件内容算出的 Hash 值， 例如上面的 app_a6976b6d.css 文件。 带上 Hash 值的原因是文件名会随着文件内容而变化，只要文件发生变化其对应的 URL 就会变化，它就会被重新下载，无论缓存时间有多长。

// 浏览器会限制同域请求数，所以可以将静态文件按类型放置到不同域名的cdn服务器上
// 例如把 JavaScript 文件放到 js.cdn.com 域名下、把 CSS 文件放到 css.cdn.com 域名下、图片文件放到 img.cdn.com 域名下

// webpack中通过publicPath添加cdn地址
// 启用hash控制缓存
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { WebPlugin } = require('web-webpack-plugin')

module.exports = {
  output: {
    // 给输出的 JavaScript 文件名称加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // ! 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/'
  },
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 压缩 CSS 代码
          use: ['css-loader?minimize'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        })
      },
      {
        // 增加对 PNG 文件的支持
        test: /\.png$/,
        // 给输出的 PNG 文件名称加上 Hash 值
        use: ['file-loader?name=[name]_[hash:8].[ext]']
      }
      // 省略其它 Loader 配置...
    ]
  },
  plugins: [
    // 使用 WebPlugin 自动生成 HTML
    new WebPlugin({
      // HTML 模版文件所在的文件路径
      template: './template.html',
      // 输出的 HTML 的文件名称
      filename: 'index.html',
      // 指定存放 CSS 文件的 CDN 目录 URL
      stylePublicPath: '//css.cdn.com/id/'
    }),
    new ExtractTextPlugin({
      // 给输出的 CSS 文件名称加上 Hash 值
      filename: `[name]_[contenthash:8].css`
    })
    // 省略代码压缩插件配置...
  ]
}
