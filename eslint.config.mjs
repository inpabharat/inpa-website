import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
  },
})
