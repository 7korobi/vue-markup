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
  entry:
    index:  './lib/index.coffee'
  output:
    path: path.join current
    filename: '[name].js' # Important
    libraryTarget: 'this' # Important

  target: 'node' # Important
  devtool: 'source-map'
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
