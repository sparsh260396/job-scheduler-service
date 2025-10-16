import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
