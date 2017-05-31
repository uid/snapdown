'use strict';

const webpack = require('webpack');

const pkgjson = require('./package.json');

module.exports = {
  entry: {
    'snapdown': './src/index.js',
    'snapdown.min': './src/index.js',
  },
  output: {
    path: './dist',
    filename: `[name].js`,
    library: 'Snapdown',
  },
  resolve: {
    alias: {
      'snapdown-parser': '../dist/snapdown-parser',
    },
  },
  module: {
    loaders: [
      { loader: 'babel-loader', include: /src|dist/, test: /\.js$/ }
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ include: /\.min\.js$/ }),
    new webpack.BannerPlugin(`Snapdown ${pkgjson.version}`),
  ],
};
