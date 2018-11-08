nodeExternals = require 'webpack-node-externals'
VueLoaderPlugin = require 'vue-loader/lib/plugin'
path = require 'path'
current = process.cwd()

coffee =
  test: /\.coffee$/
  loader: 'coffee-loader'
  options:
    transpile:
      plugins: [
        "transform-es2015-modules-commonjs"
      ]
      presets: [
        ["env", 
          targets:
            node: "10.4.1"
        ]
      ]

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
  mode: 'development'
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
  externals: [nodeExternals()] # Important
