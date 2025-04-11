import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  vueTsConfigs.recommended,
  skipFormatting,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-template': 'error',
      'no-unreachable': 'warn',
    },
  }
)
