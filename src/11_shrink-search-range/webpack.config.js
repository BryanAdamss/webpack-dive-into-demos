// 缩小文件搜索范围

// Webpack 启动后会从配置的 Entry 出发，解析出文件中的导入语句，再递归的解析。 在遇到导入语句时 Webpack 会做两件事情：

// 1.根据导入语句去寻找对应的要导入的文件。例如 require('react') 导入语句对应的文件是 ./node_modules/react/react.js，require('./util') 对应的文件是 ./util.js。
// 2.根据找到的要导入文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 去处理。

// 以上两件事情虽然对于处理一个文件非常快，但是当项目大了以后文件量会变的非常多，这时候构建速度慢的问题就会暴露出来。 虽然以上两件事情无法避免，但需要尽量减少以上两件事情的发生，以提高速度。

// 方法1
// 优化loader配置，让尽可能少的文件被loader处理
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ['babel-loader?cacheDirectory'],
        // 使用include限定loader只对项目根目录下的 src 目录中的文件进行转换
        include: path.join(__dirname, './src')
      }
    ]
  }
}

// 方法2
// 优化 resolve.modules 配置，指明第三方模块目录，减少层层查找时间
// resolve.modules 的默认值是 ['node_modules']，含义是先去当前目录下的 ./node_modules 目录下去找想找的模块，如果没找到就去上一级目录 ../node_modules 中找，再没有就去 ../../node_modules 中找，以此类推，这和 Node.js 的模块寻找机制很相似。
module.exports = {
  resolve: {
    // 例如，已经知道第三方模块都在根目录下的node_modules中，那就可以直接指定，避免从当前目录开始查找
    modules: [path.join(process.cwd(), 'node_modules')]
  }
}

// 方法3
// 优化 resolve.mainFields 配置
// resolve.mainFields 用于配置第三方模块使用哪个入口文件(package.json中的哪个入口字段:main、module...)
// 其默认值受target影响
// 当 target 为 web 或者 webworker 时，值是 ["browser", "module", "main"]；target默认为web
// 当 target 为其它情况时，值是 ["module", "main"]

// 在你明确知道第三方模块的入口文件描述字段时，可以将其放在mainFields最前面，减少搜索步骤
module.exports = {
  resolve: {
    mainFields: ['main']
  }
}

// 方法4
// 如果某个lib，你使用了所有功能，就不要使用模块化版本(模块化版本会使webpack从入口开始，解析、处理用到的文件。)可以直接使用全量完整版本，减少webpack解析、处理文件的时间
// 使用resolve.alias让webpack直接使用的全量完整包，减少webpack收集依赖时间

// 大多lib，会有两套代码，一套是模块化的代码，另外一套是把所有相关的代码打包好放到一个单独的文件中的代码(xxx.min.js)
// 例如react
// 一套是采用 CommonJS 规范的模块化代码，这些文件都放在 lib 目录下，以 package.json 中指定的入口文件 react.js 为模块的入口。
// 一套是把 React 所有相关的代码打包好的完整代码放到一个单独的文件中，这些代码没有采用模块化可以直接执行。其中 dist/react.js 是用于开发环境，里面包含检查和警告的代码。dist/react.min.js 是用于线上环境，被最小化了。

// 默认情况下 Webpack 会从入口文件 ./node_modules/react/react.js 开始递归的解析和处理依赖的几十个文件，这会时一个耗时的操作。 通过配置 resolve.alias 可以让 Webpack 在处理 React 库时，直接使用单独完整的 react.min.js 文件，从而跳过耗时的递归解析操作。
module.exports = {
  resolve: {
    alias: {
      react: path.join(process.cwd(), 'node_modules/react/dist/react.min.js')
    }
  }
}

// 方法5
// 优化 resolve.extensions 配置
// 将最常用的extension放到最前面，减少匹配的查找时间
// 在导入语句没带文件后缀时，Webpack 会自动带上resolve.extensions中声明的后缀依次去尝试询问文件是否存在。
// 所以，如果这个列表越长，或者正确的后缀在越后面，就会造成尝试的次数越多

// 后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中。
// 频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。
// 在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把 require('./data') 写成 require('./data.json')。
module.exports = {
  resolve: {
    // 尽可能的减少后缀尝试的可能性
    extensions: ['js']
  }
}

// 方法6
// 优化 module.noParse 配置
// 让webpack对没有采用模块化的文件进行忽略，避免进行递归解析
// 一般全量完整的 lib,没有采用模块化，所以可以直接设置为noParse
// 例如 react.min.js 文件就没有采用模块化
module.exports = {
  module: {
    // `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/]
  }
}
