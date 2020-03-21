const ecmaVersion = (new Date()).getFullYear() - 2009;

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  parserOptions: {
    ecmaVersion,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/indent': ['error', 2, { 'MemberExpression': 'off' }],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': 'webpack',
  },
  env: { browser: true },
};
