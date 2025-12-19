import js from '@eslint/js'
import nuxt from '@nuxt/eslint-config'

export default [
  js.configs.recommended,
  ...nuxt(),
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]