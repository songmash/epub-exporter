const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { transformManifest } = require('./helpers');

const isProduction = process.env.NODE_ENV === 'production'
const rootPath = path.resolve(__dirname, '..')
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env'],
  }
};

module.exports = {
  mode: isProduction ? 'production': 'development',
  entry: {
    popup: path.join(srcPath, 'popup.ts'),
  },
  output: { filename: '[name].js', path: distPath },
  devtool: isProduction ? false : 'inline-source-map',
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
      chunks: ['popup'],
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
            },
          },
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          'ts-loader',
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [babelLoader],
      },
    ],
  },
  resolve: {
    extensions: ['js', 'jsx', '.tsx', '.ts']
  }
};
