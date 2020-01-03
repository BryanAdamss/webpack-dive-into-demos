// 分析
// 官方分析工具
// http://webpack.github.io/analyse/
// 需要上传分析用的json文件
// json文件可通过webpack --profile --json > stats.json生成
// --profile：记录下构建过程中的耗时信息；
// --json：以 JSON 的格式输出构建结果，最后只输出一个 .json 文件，这个文件中包括所有构建相关的信息

const path = require('path')
module.exports = {
  entry: path.join(__dirname, './main.js'),
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: '[name].js', // 输出文件名
    path: path.join(__dirname, './dist') // 使用绝对路径指定输出目录
  }
}

// 使用webpack-bundle-analyzer
// 接入 webpack-bundle-analyzer 的方法很简单，步骤如下：

// 安装 webpack-bundle-analyzer 到全局，执行命令 npm i -g webpack-bundle-analyzer；
// 按照上面提到的方法生成 stats.json 文件；
// 在项目根目录中执行 webpack-bundle-analyzer 后，浏览器会打开对应网页看到以上效果。
