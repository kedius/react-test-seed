const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV || 'dev';

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
    new HtmlWebpackPlugin({
      template: `${__dirname}/index.html`
    })
  ]
};

if (env === 'dev') {
  module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
  module.exports.devServer = {
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: process.env.PORT || 7002
  };
}

if (env === 'prod') {
  module.exports.output.filename = 'assets/[name].min.js';
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  );
}
