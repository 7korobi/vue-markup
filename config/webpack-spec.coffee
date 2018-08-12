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
  devtool: 'source-map'
  entry:
    "__tests__/dagre_spec": './__tests__/dagre_spec.coffee'
    "__tests__/marked_spec": './__tests__/marked_spec.coffee'
    "__tests__/marksvg_spec": './__tests__/marksvg_spec.coffee'
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
