/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import 'regenerator-runtime/runtime'
import 'dotenv/config'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import BundleAnalyzerWebpackPlugin from '@bundle-analyzer/webpack-plugin'

const DIST_PATH = path.resolve(__dirname, 'dist')
const prod = process.env.NODE_ENV === 'production'
const dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export default {
  mode: dev ? 'development' : 'production',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.md$/,
        exclude: /node_modules/,
        use: 'raw-loader',
      },
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
  devtool: prod ? 'source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({ template: path.join('src/index.html') }),
    new webpack.EnvironmentPlugin([
      'GITHUB_CLIENT_ID',
      'SENTRY_CLIENT_DSN',
      'SENTRY_ENVIRONMENT',
      'API_BASE_URL',
      'GITHUB_APP_URL',
    ]),
    new webpack.EnvironmentPlugin({
      SENTRY_RELEASE: process.env.COMMIT_REF || '',
    }),
    ...(prod && process.env.NETLIFY
      ? [
          new BundleAnalyzerWebpackPlugin({
            configFile: path.join(__dirname, 'bundle-analyzerrc.json'),
            token: '1d75a4ed7f94f061283dfd0734c1ef3ce1a9f82a',
          }),
        ]
      : []),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
}
