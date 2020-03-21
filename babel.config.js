const { isTest } = require('./utils/env');

const testPresets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  '@babel/preset-typescript',
];

const DefaultPresets = [
  '@babel/preset-env',
];

module.exports = {
  presets: (isTest ? testPresets : DefaultPresets),
};
