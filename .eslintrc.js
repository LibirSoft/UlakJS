module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}', './**/*.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'lines-between-class-members': ['error', 'always'],
    '@typescript-eslint/member-ordering': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
      { blankLine: 'always', prev: ['case', 'default'], next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
  },
};
