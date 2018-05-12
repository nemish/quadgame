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
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname)
    }
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ],
      },
      {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ],
      },
      {
          test: /\.vue$/,
          loader: 'vue-loader',
      },
      {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets:[ 'es2015', 'stage-2' ]
          }
      },
      {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
      }
    ]















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