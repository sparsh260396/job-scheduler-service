const js = require('@eslint/js');
const tsEslint = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  tsEslint.configs.recommended,
  prettier,
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'warn',
        { alphabetize: { order: 'asc', caseInsensitive: true } },
      ],
    },
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
