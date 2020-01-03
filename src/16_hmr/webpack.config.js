// DevServer 还支持一种叫做模块热替换(Hot Module Replacement)的技术可在不刷新整个网页的情况下做到超灵敏的实时预览
// 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块

// DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数 --hot，完整命令是 webpack-dev-server --hot。

// 除了通过在启动时带上 --hot 参数，还可以通过接入 Plugin 实现，相关代码如下：
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = {
  entry: {
    // 为每个入口都注入代理客户端
    main: [
      'webpack-dev-server/client?http://localhost:8080/',
      'webpack/hot/dev-server',
      './src/main.js'
    ]
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    // 告诉 DevServer 要开启模块热替换模式
    hot: true
  }
}
// ! 在启动 Webpack 时带上参数 --hot 其实就是自动为你完成以上配置。

// 为什么有时候会刷新页面没有触发hmr
// 当子模块发生更新时，更新事件会一层层往上传递，直到有某层的文件接受了当前变化的模块或者无文件接受才停止
// 当无文件接收时，就会触发页面的刷新
// 当有文件使用module.hot.accept接收时，就不会触发刷新，如下面
import React from 'react'
import { render } from 'react-dom'
import { AppComponent } from './AppComponent'
import './main.css'

render(<AppComponent />, window.document.getElementById('app'))

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
  // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./AppComponent'], () => {
    // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
    render(<AppComponent />, window.document.getElementById('app'))
  })
}

// ! 为什么在用css、vue时，没有自己编写上述逻辑，因为style-loader、vue-loader帮我们处理了，帮我们注入了用于接受css、vue的代码

// hmr时，会显示哪个模块被替换了，以module id标识
// 可以使用NamedModulesPlugin将被替换的模块名显示出来(webpack 3.x已经自带)
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')

module.exports = {
  plugins: [
    // 显示出被替换模块的名称
    new NamedModulesPlugin()
  ]
}
