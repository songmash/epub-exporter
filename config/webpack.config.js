const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { transformManifest } = require('./helpers');

const isProduction = process.env.NODE_ENV === 'production'
const rootPath = path.resolve(__dirname, '..')
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

module.exports = {
  mode: isProduction ? 'production': 'development',
  entry: {
    main: path.join(srcPath, 'index.js'),
  },
  output: { filename: '[name].js', path: distPath },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
         from: path.join(srcPath, 'manifest.json'),
         to: path.join(distPath, 'manifest.json'),
         transform: transformManifest
      },
    ]),
  ]
};
