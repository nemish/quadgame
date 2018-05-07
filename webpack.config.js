const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        'stylus-loader',
        // {
        //   loader: 'stylus-loader',
        //   options: {
        //     use: [stylus_plugin()],
        //   },
        // },
      ],
    }]
},
  plugins: [
    new HtmlWebpackPlugin({
      meta: {
        viewport: 'width=device-width, initial-scale=1.0'
      }
    }),
    new webpack.SourceMapDevToolPlugin()
  ]
};