import globals from 'globals';

export default [
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } },
    rules: { 'no-undef': 'error', 'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }], 'no-redeclare': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error' },
  },
  {
    files: ['scripts/**/*.mjs', 'netlify/**/*.mjs', 'tests/**/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.node } },
    rules: { 'no-undef': 'error' },
  },
  {
    files: ['tests/**/*.cjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser, OMMotion: 'readonly', axe: 'readonly' } },
    rules: { 'no-undef': 'error' },
  },
];
