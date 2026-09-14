import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'out', 'dist', 'build', 'docs-site/node_modules', 'docs-site/.vitepress', '*.min.js', '**/*.ts', '**/*.tsx']
  },
  js.configs.recommended,
  {
    files: ['e2e/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser }
    }
  },
  {
    files: ['*.js', '*.config.js', '*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node
    }
  },
  eslintConfigPrettier
];
