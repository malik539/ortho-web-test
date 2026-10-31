import globals from 'globals';

export default [
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } },
    rules: { 'no-undef': 'error', 'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }], 'no-redeclare': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error' },
  },
  {
    files: ['tests/**/*.cjs', 'scripts/**/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser } },
    rules: { 'no-undef': 'error' },
  },
];
