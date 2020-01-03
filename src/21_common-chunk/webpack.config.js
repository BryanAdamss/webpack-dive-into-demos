// 通过 Webpack 提取多个chunk中的公共代码
// Webpack 内置了专门用于提取多个 Chunk 中公共部分的插件 CommonsChunkPlugin
// CommonsChunkPlugin 已经从 webpack v4 legato 中移除。想要了解在最新版本中如何处理 chunk，请查看 SplitChunksPlugin。
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

new CommonsChunkPlugin({
  // 从哪些 Chunk 中提取
  chunks: ['a', 'b'],
  // 提取出的公共部分形成一个新的 Chunk，这个新 Chunk 的名称
  name: 'common'
})

// 以上配置就能从网页 A 和网页 B 中抽离出公共部分，放到 common 中

// 最佳实践
// 基础chunk(base 万年不会变的，例如vue) + 公用chunk(每个页面公用，但又不出现在base中的代码) + 独有chunk(每个页面单独需要的代码)

// CommonsChunkPlugin 提供一个选项 minChunks，表示文件要被提取出来时需要在指定的 Chunks 中最小出现最小次数。 假如 minChunks=2、chunks=['a','b','c','d']，任何一个文件只要在 ['a','b','c','d'] 中任意两个以上的 Chunk 中都出现过，这个文件就会被提取出来。 你可以根据自己的需求去调整 minChunks 的值，minChunks 越小越多的文件会被提取到 common.js 中去，但这也会导致部分页面加载的不相关的资源越多； minChunks 越大越少的文件会被提取到 common.js 中去，但这会导致 common.js 变小、效果变弱。
// 根据各个页面之间的相关性选取其中的部分页面用 CommonsChunkPlugin 去提取这部分被选出的页面的公共部分，而不是提取所有页面的公共部分，而且这样的操作可以叠加多次。 这样做的效果会很好，但缺点是配置复杂，你需要根据页面之间的关系去思考如何配置，该方法不通用
