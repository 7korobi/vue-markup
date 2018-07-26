nodeExternals = require 'webpack-node-externals'
path = require 'path'
current = process.cwd()

coffee =
  test: /\.coffee$/,
  loader: 'babel-loader!coffee-loader'

vue =
  test: /\.vue$/,
  loader: 'vue-loader'

module.exports =
  target: 'node' # Important
  devtool: 'source-map'
  entry:
    "lib/index.min":  './src/index.coffee'
  output:
    path: current
    filename: '[name].js' # Important
    libraryTarget: 'this' # Important

  module:
    rules: [
      coffee
      vue
    ]

  resolve:
    extensions: [ '.coffee', '.js' ]
    alias:
      '@': current
      '~': current

  plugins: []
  externals: [nodeExternals()] # Important
