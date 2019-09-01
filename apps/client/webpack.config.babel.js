/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'dotenv/config'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const DIST_PATH = path.resolve(__dirname, 'dist')
const prod = process.env.NODE_ENV === 'production'
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export default {
  mode: dev ? 'development' : 'production',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
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
  plugins: [
    new HtmlWebpackPlugin({ template: path.join('src/index.html') }),
    new webpack.EnvironmentPlugin(['GITHUB_CLIENT_ID']),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
}
