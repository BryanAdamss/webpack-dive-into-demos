// Tree Shaking在webpack 2.0 已经自带
// 只能针对esm使用，基于esm进行静态分析的
// 所以，在使用babel转换es时，必选关闭babel自带的模块转换(转成其他模块系统)

// {
//   "presets": [
//     [
//       "env",
//       {
//         "modules": false // 关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法，交给webpack处理
//       }
//     ]
//   ]
// }

// ! 在启动 Webpack 时带上 --display-used-exports 参数，以方便追踪 Tree Shaking 的工作

// Webpack 只是指出了哪些函数用上了哪些没用上，要剔除用不上的代码还得经过 UglifyJS 去处理一遍。无需其他配置
