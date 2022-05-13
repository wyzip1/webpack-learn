/**
 * 运行环境指令
 * 开发环境：webpack ./src/index.js -o ./build --mode=development
 *    指令解释：webpack 会以 ./src/index.js 作为入口文件开始打包，打包后输出到 ./build，打包的环境为开发环境
 * 
 * 生产环境：webpack ./src/index.js -o ./build --mode=production
 * 
 * 结论：
 *    webpack可以处理js和json资源，不能处理css/img文件，
 *    生产环境会打包压缩js代码
 * 
 * */
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')

const isPro = process.env.NODE_ENV === 'production'
const lastCssLoader = isPro ? MiniCssExtractPlugin.loader : 'style-loader'

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    // 开启css import 使用，class和id名称将被混淆，无法使用原来样式名称
    modules: false,
    sourceMap: !isPro
  }
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader' },
      { test: /\.vue$/, use: ['vue-loader'] },
      // 处理css样式
      {
        test: /\.(css|s[ca]ss)$/,
        // use数组中 loader 的执行顺序为栈模式，靠后的先执行
        use: [lastCssLoader, cssLoader, {
          loader: 'postcss-loader', options: {
            sourceMap: !isPro,
            postcssOptions: {
              plugins: [['postcss-preset-env']]
            }
          }
        }, 'sass-loader']
      },
      // 处理图片资源
      {
        test: /\.(jpe?g|png|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/imgs/[hash:5][ext]'
        },
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 }
        }
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/iconfont/[hash:5][ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: 'chunk[id].css'
    }),
    new DefinePlugin({
      '__VUE_OPTIONS_API__': true,
      '__VUE_PROD_DEVTOOLS__': false
    })
  ],
  optimization: {
    splitChunks: {
      minChunks: 3,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    }
  },
  mode: isPro ? 'production' : 'development',

  /**
   * 安装 webpack-dev-server
   * 热更新、自动打开浏览器、自动刷行浏览器
   * */
  devServer: {
    open: true,       // 自动打开浏览器
    port: 8080,       // 运行端口
    compress: true,   // 开启压缩
    static: {
      directory: resolve(__dirname, 'src')  // 静态资源目录
    }
  },

  //警告 webpack 的性能提示
  performance: {
    hints:'warning',
    //入口起点的最大体积
    maxEntrypointSize: 50000000,
    //生成文件的最大体积
    maxAssetSize: 30000000,
    //只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    }
  }
}