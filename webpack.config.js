const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: ['babel-polyfill', './main.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'assets/[name].js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/index.html`
    })
  ],
  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: process.env.PORT || 7002
  }
};
