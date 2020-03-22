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
    '@typescript-eslint/explicit-function-return-type': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'import/no-extraneous-dependencies': 'off',
    'no-new': 'off',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': 'webpack',
  },
  env: { browser: true },
};
