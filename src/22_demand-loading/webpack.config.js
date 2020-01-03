// 按需加载
// 动态加载 + magic comment + chunkfilename

const path = require('path')
module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkfilename: '[name].js' // 设置未分配name的chunk 名称
  }
}

window.document.getElementById('btn').addEventListener('click', function() {
  // 当按钮被点击后才去加载 show.js 文件，文件加载成功后执行文件导出的函数
  // ! show.js将会被单独打包成一个bundle
  import(/* webpackChunkName: "show" */ './show').then(show => {
    show('Webpack')
  })
})
