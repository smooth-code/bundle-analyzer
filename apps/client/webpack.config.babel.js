/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'regenerator-runtime/runtime'
import 'dotenv/config'
import { gzipSync } from 'zlib'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import axios from 'axios'
import gzipSize from 'gzip-size'
import brotliSize from 'brotli-size'

const readFile = promisify(fs.readFile)

const DIST_PATH = path.resolve(__dirname, 'dist')
const prod = process.env.NODE_ENV === 'production'
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

async function sizeAssets(stats) {
  return Promise.all(
    stats.assets.map(async asset => {
      const fullPath = path.join(stats.outputPath, asset.name)
      const buffer = await readFile(fullPath)
      return {
        ...asset,
        gzipSize: await gzipSize(buffer),
        brotliSize: await brotliSize(buffer),
      }
    }),
  )
}

class BundleAnalyzer {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      '@bundle-analyzer/webpack-plugin',
      (hookCompiler, callback) => {
        const stats = hookCompiler.getStats().toJson({
          maxModules: Infinity,
          source: false,
        })

        async function sendBuild() {
          const assets = await sizeAssets(stats)

          const { data: build } = await axios.post(
            'http://localhost:3000/builds',
            {
              token: '7ec3fe25a1cf772a95fb94558610b1ece5a899b1',
              branch: 'feat',
              commit: '66e40f862d63c261b84865fb9fa730d005e4f6d3',
              stats: {
                assets,
                chunksNumber: stats.chunks.length,
                modulesNumber: stats.modules.length,
                assetsNumber: stats.assets.length,
              },
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
            token: '7ec3fe25a1cf772a95fb94558610b1ece5a899b1',
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
