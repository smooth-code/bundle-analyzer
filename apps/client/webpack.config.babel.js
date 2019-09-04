/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'regenerator-runtime/runtime'
import 'dotenv/config'
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
          hash: true,
          publicPath: true,
          assets: true,
          chunks: true,
          modules: true,
          source: false,
          errorDetails: true,
          timings: true,
        })

        async function sendBundleInfo() {
          const result = await axios.post(
            'http://localhost:3000/bundle-infos',
            {
              token: 'adcfb2a9850b616483d5ebbe38fdff2035bfc415',
              branch: 'master',
              commit: 'xxx',
            },
          )

          await axios.request({
            method: 'put',
            url: result.data,
            data: Buffer.from(JSON.stringify(stats)),
          })
        }

        sendBundleInfo()
          .then(() => {
            callback()
          })
          .catch(error => {
            console.log(error.response.data)
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
