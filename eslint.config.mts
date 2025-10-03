import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // shared ignores
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
  // shared ts rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'no-restricted-syntax': [
        'error',
        'FunctionExpression',
        'FunctionDeclaration',
      ],
    },
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
]);
