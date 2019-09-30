const path = require('path')

module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true, targets: { node: 'current' } }],
  ],
  plugins: [
    ['module-resolver', { root: [path.resolve(__dirname, './src')] }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
}
