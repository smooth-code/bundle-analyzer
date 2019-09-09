/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'regenerator-runtime/runtime'
import 'dotenv/config'
import { gzipSync } from 'zlib'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import axios from 'axios'

const DIST_PATH = path.resolve(__dirname, 'dist')
const prod = process.env.NODE_ENV === 'production'
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

class BundleAnalyzer {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      '@bundle-analyzer/webpack-plugin',
      (hookCompiler, callback) => {
        const stats = hookCompiler.getStats().toJson({
          maxModules: Infinity,
          source: false,
        })

        async function sendBuild() {
          const { data: build } = await axios.post(
            'http://localhost:3000/builds',
            {
              token: '2700fb9e81d873a3fb2661d66e0031b920fe510c',
              branch: 'master',
              commit: 'xxx',
            },
          )

          await axios.request({
            method: 'put',
            url: build.webpackStatsPutUrl,
            data: gzipSync(Buffer.from(JSON.stringify(stats))),
            headers: {
              'content-encoding': 'gzip',
            },
            maxContentLength: 30 * 1024 * 1024,
          })

          await axios.post(`http://localhost:3000/builds/${build.id}/start`, {
            token: '2700fb9e81d873a3fb2661d66e0031b920fe510c',
          })
        }

        sendBuild()
          .then(() => {
            callback()
          })
          .catch(error => {
            console.error(error)
            callback(error)
          })
      },
    )
  }
}

export default {
  name: 'SUPER_BUILD',
  mode: dev ? 'development' : 'production',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: DIST_PATH,
    filename: prod ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join('src/index.html') }),
    new webpack.EnvironmentPlugin(['GITHUB_CLIENT_ID']),
    ...(prod ? [new BundleAnalyzer()] : []),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
}
