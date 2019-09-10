/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'regenerator-runtime/runtime'
import 'dotenv/config'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import BundleAnalyzerWebpackPlugin from '@bundle-analyzer/webpack-plugin'

const DIST_PATH = path.resolve(__dirname, 'dist')
const prod = process.env.NODE_ENV === 'production'
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export default {
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
    new webpack.EnvironmentPlugin([
      'GITHUB_CLIENT_ID',
      'SENTRY_CLIENT_DSN',
      'SENTRY_ENVIRONMENT',
    ]),
    new webpack.EnvironmentPlugin({
      SENTRY_RELEASE: process.env.HEROKU_SLUG_COMMIT || '',
    }),
    ...(prod
      ? [
          // new BundleAnalyzerWebpackPlugin({
          //   token: '7ec3fe25a1cf772a95fb94558610b1ece5a899b1',
          // }),
        ]
      : []),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
}
