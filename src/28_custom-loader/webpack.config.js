// 如何编写loader
// https://webpack.docschina.org/contribute/writing-a-loader/

// loader原理
// loader可以当成一个翻译机器。能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译。
// 以处理 SCSS 文件为例：

// SCSS 源代码会先交给 sass-loader 把 SCSS 转换成 CSS；
// 把 sass-loader 输出的 CSS 交给 css-loader 处理，找出 CSS 中依赖的资源、压缩 CSS 等；
// 把 css-loader 输出的 CSS 交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码；

// loader的职责是单一，一个loader只需要完成一种转换即可

// loader是一个nodejs模块，这个模块需要导出一个函数。
// 这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容（类似纯函数）
// 一个最简单的 Loader 的源码如下：
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source
}

// ! 使用 loader-utils包 拿到传给自定义loader的options
// loader-utils是官方提供的包
const loaderUtils = require('loader-utils')
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this)

  return source
}

// ! 返回多个结果时，必须调用this.callback
module.exports = function(source) {
  // 通过 this.callback 告诉 Webpack 返回的结果
  // 同时返回source和sourceMaps
  this.callback(null, transformedSource, sourceMaps)
  // ! 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中
  return
}

// ! callback详细参数
// this.callback(
//   // 当无法转换原内容时，给 Webpack 返回一个 Error
//   err: Error | null,
//   // 原内容转换后的内容
//   content: string | Buffer,
//   // 用于把转换后的内容得出原内容的 Source Map，方便调试
//   sourceMap?: SourceMap,
//   // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
//   // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
//   abstractSyntaxTree?: AST
// );

// Source Map 的生成很耗时，通常在开发环境下才会生成 Source Map，其它环境下不用生成，以加速构建。 为此 Webpack 为 Loader 提供了 this.sourceMap API 去告诉 Loader 当前构建环境下用户是否需要 Source Map。 如果你编写的 Loader 会生成 Source Map，请考虑到这点。

// ! loader中有异步操作时，需要调用async告诉webpack，等待loader调用callback
module.exports = function(source) {
  // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
  var callback = this.async()
  someAsyncOperation(source, function(err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast)
  })
}

// ! loader可以接收或者返回二进制数据
module.exports = function(source) {
  // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的

  // Loader 返回的类型也可以是 Buffer 类型的
  //无论exports.raw是什么值，loader都可以返回 Buffer 类型的结果
  return source
}

// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据；其他值，loader接收到的都是string类型
module.exports.raw = true

// ! 缓存加速
// webpack会为loader默认开启缓存功能
// 调用cacheable，可关闭缓存功能
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false)
  return source
}

// ! 其他loader api
// https://webpack.docschina.org/api/loaders/

// ! 如何加载、测试本地loader
// ! 使用npm link(加载一个是独立项目的自定义loader，自定义loader是单独一个项目)
// Npm link 专门用于开发和调试本地 Npm 模块，能做到在不发布模块的情况下，把本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，让项目可以直接使用本地的 Npm 模块。 由于是通过软链接的方式实现的，编辑了本地的 Npm 模块代码，在项目中也能使用到编辑后的代码。

// 完成 Npm link 的步骤如下：

// 1.确保正在开发的本地 Npm 模块（也就是正在开发的 Loader）的 package.json 已经正确配置好；
// 2.在本地 Npm 模块根目录下执行 npm link，把本地模块(将loader注册到全局)注册到全局；
// 3.在使用自定义loader的项目根目录下执行 npm link loader-name，把第2步注册到全局的本地 Npm 模块链接到项目的 node_moduels 下，其中的 loader-name 是指在第1步中的 package.json 文件中配置的模块名称。
// 链接好 Loader 到项目后你就可以像使用一个真正的 Npm 模块一样使用本地的 Loader 了。

// ! 使用resolveLoader.modules(加载当前项目中的某个自定义loader)
module.exports = {
  resolveLoader: {
    // 去哪些目录下寻找 Loader，有先后顺序之分
    // 会在node_modules中找不到的时候，从loaders文件夹中寻找
    modules: ['node_modules', './loaders/']
  }
}

// ! 实现一个注释导入的loader
// 将@require '../style/index.css'
// 转换成
// require('../style/index.css');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['comment-require-loader'],
        // 针对采用了 fis3 CSS 导入语法的 JavaScript 文件通过 comment-require-loader 去转换
        include: [path.resolve(__dirname, 'node_modules/imui')]
      }
    ]
  }
}

// comment-require-loader.js
function replace(source) {
  // 使用正则把 // @require '../style/index.css' 转换成 require('../style/index.css');
  return source.replace(/(\/\/ *@require) +(('|").+('|")).*/, 'require($2);')
}

module.exports = function(content) {
  return replace(content)
}
