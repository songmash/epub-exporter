const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { transformManifest } = require('./helpers');

const isProduction = process.env.NODE_ENV === 'production'
const rootPath = path.resolve(__dirname, '..')
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

module.exports = {
  mode: isProduction ? 'production': 'development',
  entry: {
    popup: path.join(srcPath, 'popup.js'),
  },
  output: { filename: '[name].js', path: distPath },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['!manifest.json'],
    }),
    new CopyWebpackPlugin([
      {
         from: path.join(srcPath, 'manifest.json'),
         to: path.join(distPath, 'manifest.json'),
         transform: transformManifest
      },
    ]),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: path.join(srcPath, 'popup.html'),
      chunks: ['popup']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s(a|c)ss$/,
        loader: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['js', 'jsx', '.tsx', '.ts']
  }
};
