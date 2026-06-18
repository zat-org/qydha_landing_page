// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
export default withNuxt(
  {
    ignores: ['.nuxt/**', '.output/**', 'node_modules/**'],
  },
  {
    rules: {
      // Existing codebase — start as warnings, tighten over time
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/attributes-order': 'warn',
      'vue/first-attribute-linebreak': 'warn',
      'vue/html-self-closing': 'warn',
    },
  },
  eslintConfigPrettier,
)
