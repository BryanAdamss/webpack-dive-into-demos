// Scope Hoisting指的是将那些被引用了一次的模块合并到使用的模块中。

// util.js:
export default 'Hello,Webpack'

// main.js:

import str from './util.js'
console.log(str)

// 正常输出
// [
//   function(module, __webpack_exports__, __webpack_require__) {
//     var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(1)
//     console.log(__WEBPACK_IMPORTED_MODULE_0__util_js__['a'])
//   },
//   function(module, __webpack_exports__, __webpack_require__) {
//     __webpack_exports__['a'] = 'Hello,Webpack'
//   }
// ]

// 开启Scope Hoisting后
// [
//   function(module, __webpack_exports__, __webpack_require__) {
//     var util = 'Hello,Webpack' // ! utils.js内容被合并到main.js中
//     console.log(util)
//   }
// ]

// webpack内置此plugin
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')

module.exports = {
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin()
  ]
}
