const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production': 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
