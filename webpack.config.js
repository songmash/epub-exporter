const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

const transformManifest = require('./utils/transformManifest');
const { appPath, appSrc, appDist, appTest } = require('./utils/paths');
const { isProduction, isDevelopment } = require('./utils/env');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: isDevelopment,
  },
};

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    popup: path.join(appSrc, 'popup.tsx'),
    contentScript: path.join(appSrc, 'contentScript.ts'),
  },
  output: { filename: '[name].js', path: appDist },
  devtool: isProduction ? false : 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['!manifest.json'],
    }),
    new CopyWebpackPlugin([
      { from: path.join(appSrc, 'manifest.json'), to: path.join(appDist, 'manifest.json'), transform: transformManifest },
    ]),
    new HtmlWebpackPlugin({ filename: 'popup.html', template: path.join(appSrc, 'popup.html'), chunks: ['popup'] }),
    new StylelintWebpackPlugin({ context: appSrc }),
  ],
  module: {
    rules: [
      /**
       * ESLINT
       * First, run the linter.
       * It's important to do this before Babel processes the JS.
       * Only testing .ts and .tsx files (React code)
       */
      {
        test: /\.(ts|js)x?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [{ loader: 'eslint-loader', options: { cache: true } }],
      },
      {
        test: /\.(css|sass|scss)$/,
        loader: [
          { loader: 'style-loader' },
          { loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
              importLoaders: 2,
              modules: { mode: 'global' },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: isDevelopment,
              ident: 'postcss',
              plugins: () => [
                require('postcss-import')({ root: appPath }),
                require('postcss-preset-env')(),
                require('cssnano')(),
              ],
            },
          },
          { loader: 'sass-loader', options: { sourceMap: isDevelopment } },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          'ts-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [babelLoader],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': appSrc,
      '@test': appTest,
    },
  },
};
