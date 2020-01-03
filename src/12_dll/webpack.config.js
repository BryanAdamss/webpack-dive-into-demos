const path = require('path')

// ! webpack 3.x中使用dll动态链接库技术，提升本地构建速度
// ! webpack 4.x中可以不使用，因为webpack 4.x 的性能已经足够好，不需要使用dll
// ! https://juejin.im/post/5d8aac8fe51d4578477a6699

// dll 是一个缓存机制，将一些不会变化的包(一般是第三方的vendor包)提前打好放在本地，然后供其他地方引用，每次编译时，这些被打包好的vendor包，不会再重新编译了
// dll 一般会生成两个文件，一个.js一个.json，前者是打包好的模块集合，后者是一个清单文件主要用来说明有哪些模块被打包到dll中了

// 一般dll，需要单独新建一个webpack config，用来生成dll

// 在 webpack_dll.config.js 文件中，DllPlugin 中的 name 参数必须和 output.library 中保持一致。 原因在于 DllPlugin 中的 name 参数会影响输出的 manifest.json 文件中 name 字段的值， 而在 webpack.config.js 文件中 DllReferencePlugin 会去 manifest.json 文件读取 name 字段的值， 把值的内容作为在从全局变量中获取动态链接库中内容时的全局变量名。

const DllPlugin = require('webpack/lib/DllPlugin')

// ! 生成
module.exports = {
  // JS 执行入口文件
  entry: {
    // 把项目需要所有的 polyfill 放到一个单独的动态链接库
    polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]'
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    })
  ]
}

// ! 使用webpack/lib/DllReferencePlugin来引用dll
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')

module.exports = {
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库

    new DllReferencePlugin({
      // 描述 polyfill 动态链接库的文件内容
      manifest: require('./dist/polyfill.manifest.json')
    })
  ],
  devtool: 'source-map'
}

// ! 为了简化上述步骤，可以直接使用autodll-webpack-plugin

// 文件目录：configs/webpack.common.js
const AutoDllPlugin = require('autodll-webpack-plugin') // 第 1 步：引入 DLL 自动链接库插件

module.exports = {
  // ......
  plugins: [
    // 第 2 步：配置要打包为 dll 的文件
    new AutoDllPlugin({
      inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
      filename: '[name].dll.js',
      context: path.resolve(__dirname, '../'), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
      entry: {
        react: ['react', 'react-dom']
      }
    })
  ]
}
