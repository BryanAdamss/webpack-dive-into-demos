const path = require('path')

module.exports = {
  entry: {
    main: path.join(__dirname, './main.js')
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?url=false']
      }
    ]
  },
  // Resolve 配置 Webpack 如何寻找模块所对应的文件
  resolve: {
    // 在导入语句没带文件后缀时(import xx from 'Utils/tool')，Webpack 会自动带上后缀后去尝试访问文件是否存在
    // 根据指定顺序依次尝试，所以应该将常用的文件后缀放前面
    // 例如ts项目，大部分文件为.ts后缀，所以'.ts'应该放在首位
    extensions: ['.ts', '.js', '.json'],
    // 配置路径别名，解析'Assets/global.css'会解析到__dirname/../assets/resolve.css'
    alias: {
      '@': path.join(__dirname, '../'),
      Assets: path.join(__dirname, '../assets'),
      // 别名，可以使用$表示精准匹配
      // https://webpack.docschina.org/configuration/resolve/#resolve-alias
      // import Vue from 'vue'时，会触发精准匹配，从vue/dist/vue.esm.js中导入Vue
      // import Observer from 'vue/core/Observer'，非精准匹配，会按照默认模块查找规则查询，node_modules/vue/core/Observer
      // import Comp1 from './Comp1.vue'，虽然是vue结尾，但不会触发精准匹配(只有from后面的路径只有"vue"，才会触发精准匹配)
      vue$: 'vue/dist/vue.esm.js'
    },
    // resolve.modules(注意结尾有s)告诉Webpack 去哪些目录下寻找第三方模块；
    // 相对、绝对路径都可以
    // 默认值为'node_modules'，类似node查找node_modules机制，会当前目录(__dirname)逐层查找node_modules，如果知道第三方模块放在哪，可以直接指定一个绝对路径，提高查找性能
    // 下面配置直接从当前cwd下的node_modules查找，避免逐层查找；如果未查找到，再用'node_modules'逐层查找
    modules: [path.join(process.cwd(), './node_modules'), 'node_modules']

    // 是否强制在解析模块时，需要指明后缀；默认为false；一般不会修改
    // 若为true,require('./test')会失败，require('./test.js')会成功
    // enforceExtension :false

    // enforceModuleExtension 和 enforceExtension 作用类似，但 enforceModuleExtension 只对 node_modules 下的模块生效。 enforceModuleExtension 通常搭配 enforceExtension 使用，在 enforceExtension:true 时，因为安装的第三方模块中大多数导入语句没带文件后缀， 所以这时通过配置 enforceModuleExtension:false 来兼容第三方模块。
    // enforceModuleExtension :false

    // 指定从npm中导入包时，使用package.json中的哪个字段导入模块(因为一个lib，可能会提供多份代码)
    // mainFields的默认值会和webpack.target有关系，target指定了构建的目标环境，默认值为`web`(一般不会修改)；
    // 当 target 属性设置为 webworker, web 或者没有指定时
    // mainFields为 ['browser', 'module', 'main']，依次从package.json中读取browser、module、main字段，找到立即停止
    // 对于其他任意的 target，mainFields为 ['module', 'main']
    // mainFields: ['browser', 'module', 'main']
  }
}
