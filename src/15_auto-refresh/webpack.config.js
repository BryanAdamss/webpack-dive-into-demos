// webpack内置自动刷新功能
// 自动刷新
// 第一步，需要监听文件的变化，重新编译
// 第二步，编译后，刷新浏览器

// 监听文件的变化，只需要在配置中提供watch选项或者在CLI中指明--watch即可
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}

// 文件监听工作原理
// 轮询要监听文件的最后编辑时间，若与上一次保存的时间不一致，则认为文件变化了，需要重新编译；watchOptions.poll 就是用于控制定时检查的周期，具体含义是每隔多少毫秒检查一次
// 当发现某个文件发生了变化时，并不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。 配置项中的 watchOptions.aggregateTimeout 就是用于配置这个等待时间。 这样做的目的是因为我们在编辑代码的过程中可能会高频的输入文字导致文件变化的事件高频的发生，如果每次都重新执行构建就会让构建卡死。
// 默认情况下 Webpack 会从配置的 Entry 文件出发，递归解析出 Entry 文件所依赖的文件，把这些依赖的文件都加入到监听列表中去。 可见 Webpack 这一点还是做的很智能的，不是粗暴的直接监听项目目录下的所有文件。

// 优化文件监听性能
// 1. 取消对node_modules的监听；node_modules中的文件大概率不会修改；及时修改了，手动编译一下就可以解决了
module.export = {
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/
  }
}
// 2. watchOptions.aggregateTimeout 值越大性能越好，因为这能降低重新构建的频率。
// 3. watchOptions.poll 值越大越好，因为这能降低检查的频率。

// 重新编译后，就需要通知浏览器刷新
// webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器

// 自动刷新的原理
// 控制浏览器刷新有三种方法：

// 1. 借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
// 2. 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。 inline:true
// 3. 把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。 inline:false

// webpack-dev-server使用2、3种，第2种在inline为true时使用(默认)，第3种在inline为false时使用
// 第2种会在输出的chunk中，注入代理客户端的代码，代理客户端的代码主要负责和dev-server通信并刷新浏览器
// 事实上，在开启 inline 时，DevServer 会为每个输出的 Chunk 中注入代理客户端的代码，当你的项目需要输出的 Chunk 有很多个时，这会导致你的构建缓慢。 其实要完成自动刷新，一个页面只需要一个代理客户端就行了，DevServer 之所以粗暴的为每个 Chunk 都注入，是因为它不知道某个网页依赖哪几个 Chunk，索性就全部都注入一个代理客户端。 网页只要依赖了其中任何一个 Chunk，代理客户端就被注入到网页中去。
// 这里优化的思路是关闭还不够优雅的 inline 模式，只注入一个代理客户端。 为了关闭 inline 模式，在启动 DevServer 时，可通过执行命令 webpack-dev-server --inline false（也可以在配置文件中设置）

// 如果你不想通过 iframe 的方式去访问，但同时又想让网页保持自动刷新功能，你需要手动往网页中注入代理客户端脚本，往 index.html 中插入以下标签：

// <!--注入 DevServer 提供的代理客户端脚本，这个服务是 DevServer 内置的-->
/* <script src="http://localhost:8080/webpack-dev-server.js"></script> */

// 给网页注入以上脚本后，独立打开的网页就能自动刷新了。但是要注意在发布到线上时记得删除掉这段用于开发环境的代码。
