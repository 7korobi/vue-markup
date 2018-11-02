nodeExternals = require 'webpack-node-externals'
VueLoaderPlugin = require 'vue-loader/lib/plugin'

path = require 'path'
current = process.cwd()

coffee =
  test: /\.coffee$/
  loader: 'babel-loader!coffee-loader'

sass =
  test: /\.sass$/
  loader: 'sass-loader'

vue =
  test: /\.vue$/
  loader: 'vue-loader'

pug =
  test: /\.pug$/
  loader: 'pug-plain-loader'

module.exports =
  mode: 'production'
  target: 'node' # Important
  devtool: 'source-map'
  entry:
    "lib/index.min":  './src/index.coffee'
  output:
    path: current
    filename: '[name].js' # Important
    library: 'VueMarkup', # Important
    libraryTarget: 'umd'  # Important

  module:
    rules: [
      coffee
      sass
      pug
      vue
    ]

  resolve:
    extensions: [ '.coffee', '.js' ]
    alias:
      '@': current
      '~': current

  plugins: [ new VueLoaderPlugin() ]
