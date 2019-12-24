const path = require('path')

// __dirname指向当前执行文件(src/00_hello-webpack/webpack.config.js)所在目录(src/00_hello-webpack/)
// process.cwd()指向当前执行node命令时候的文件夹地址，运行此webpack命令时，node命令所处的目录，此处即工作目录(即dive-into-webpack-demos/)

module.exports = {
  entry: path.join(__dirname, './main.js'), // 使用绝对路径指定入口
  output: {
    filename: '00_hello-webpack-bundle.js', // 输出文件名
    path: path.join(process.cwd(), './dist') // 使用绝对路径指定输出目录
  }
}
