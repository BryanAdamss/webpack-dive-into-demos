// prepack指的是在本地预先求值
// ! 编译代码时提前将计算结果放到编译后的代码中，而不是在代码运行时才去求值
import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

function hello(name) {
  return 'hello ' + name
}

class Button extends Component {
  render() {
    return hello(this.props.name)
  }
}

console.log(renderToString(<Button name="webpack" />))

// 被 Prepack 转化后竟然直接输出如下：

console.log('hello webpack')

// 局限性：
// 不能识别 DOM API 和 部分 Node.js API，如果源码中有调用依赖运行环境的 API 就会导致 Prepack 报错；
// 存在优化后的代码性能反而更低的情况；
// 存在优化后的代码文件尺寸大大增加的情况。

// webpack中可以使用prepack-webpack-plugin
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default

module.exports = {
  plugins: [new PrepackWebpackPlugin()]
}
