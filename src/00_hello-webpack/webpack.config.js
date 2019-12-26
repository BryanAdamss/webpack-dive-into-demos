const path = require('path')

// Webpack 是一个打包模块化 JavaScript 的工具，它会从 main.js 出发，识别出源码中的模块化导入语句， 递归的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。 从 Webpack2 开始，已经内置了对 ES6、CommonJS、AMD 模块化语句的支持

// __dirname指向当前执行文件(src/00_hello-webpack/webpack.config.js)所在目录(src/00_hello-webpack/)
// process.cwd()指向当前执行node命令时候的文件夹地址，运行此webpack命令时，node命令所处的目录，此处即工作目录(即dive-into-webpack-demos/)

// 由于 Webpack 构建运行在 Node.js 环境下，所以该文件最后需要通过 CommonJS 规范导出一个描述如何构建的 Object 对象
module.exports = {
  context: path.join(process.cwd(), './src/00_hello-webpack'), // entry、loader都会基于此路径查找
  entry: './main.js', // 指定入口；entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main；如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称；若路径为相对路径，则真实路径为context + entry；context默认为process.cwd()；所以一般会指定context
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: '00_hello-webpack-bundle.js', // 输出文件名
    path: path.join(__dirname, './dist') // 使用绝对路径指定输出目录
  }
}
