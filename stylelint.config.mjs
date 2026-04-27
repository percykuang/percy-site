/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.turbo/**',
    '**/packages/db/src/generated/**',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme', 'source', 'utility', 'variant', 'custom-variant', 'apply'],
      },
    ],
    'custom-property-pattern': null,
    'hue-degree-notation': null,
    'import-notation': null,
    'lightness-notation': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
      extends: ['stylelint-config-standard-vue'],
    },
  ],
}
