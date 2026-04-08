/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard', // Standard CSS linting rules
    'stylelint-config-standard-scss', // Standard SCSS linting rules
    'stylelint-config-recess-order', // Property order based on RECESS conventions
    'stylelint-prettier/recommended', // Integrates Prettier formatting
    'stylelint-config-prettier-scss', // Disables conflicting Prettier + SCSS rules
  ],
  plugins: ['@stylistic/stylelint-plugin'], // Required for Stylelint v16+ (stylistic rules moved out of core)
  rules: {
    // --- Prettier integration ---
    // Enforce Prettier formatting
    'prettier/prettier': true,

    // // --- Stylistic rules (migrated from core → @stylistic) ---

    // // Enforce 2-space indentation
    // '@stylistic/indentation': 2,

    // // Allow only one consecutive empty line
    // '@stylistic/max-empty-lines': 1,

    // // Require a leading zero for fractional numbers (0.5)
    // '@stylistic/number-leading-zero': 'always',

    // // Disallow trailing zeros (1.0 → 1)
    // '@stylistic/number-no-trailing-zeros': true,

    // // Enforce lowercase units (px, em, etc.)
    // '@stylistic/unit-case': 'lower',

    // // Enforce lowercase pseudo-class names (:hover)
    // '@stylistic/selector-pseudo-class-case': 'lower',

    // // Require newline after each declaration block semicolon
    // '@stylistic/declaration-block-semicolon-newline-after': 'always',

    // --- General CSS & SCSS rules ---

    // Disallow duplicate selectors
    'no-duplicate-selectors': true,

    // // Require an empty line before rules
    // 'rule-empty-line-before': ['always'],

    // Use short hex colors (#fff instead of #ffffff)
    'color-hex-length': 'short',

    // Disallow named colors like "red"
    'color-named': 'never',

    // Disallow vendor prefixes in property names
    'property-no-vendor-prefix': true,

    // Disallow vendor prefixes in property values
    'value-no-vendor-prefix': true,

    // Always use quotes around URLs
    'function-url-quotes': 'always',

    // Use numeric font weights (e.g., 700 instead of bold)
    'font-weight-notation': 'numeric',

    // Add quotes around font-family names when needed
    'font-family-name-quotes': 'always-where-recommended',

    // Disallow vendor prefixes for at-rules (@-webkit-keyframes)
    'at-rule-no-vendor-prefix': true,

    // Disallow vendor prefixes in selectors (::-webkit-input-placeholder)
    'selector-no-vendor-prefix': true,

    // Disallow vendor prefixes in media features
    'media-feature-name-no-vendor-prefix': true,

    // Enforce kebab-case for SCSS variable names
    'scss/dollar-variable-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',

    // Prevent extending non-placeholder selectors
    'scss/at-extend-no-missing-placeholder': true,

    // Disallow !important
    'declaration-no-important': true,

    // Disallow units on zero values (0px → 0)
    'length-zero-no-unit': true,

    // Disallow duplicate properties in a declaration block
    'declaration-block-no-duplicate-properties': true,

    // Disallow irregular (invisible) whitespace
    'no-irregular-whitespace': true,

    // Disallow usage of ID selectors
    'selector-max-id': 0,

    // Disable enforcement of range notation style in media queries
    'media-feature-range-notation': null,

    // Enforce double-colon notation for pseudo-elements (::before)
    'selector-pseudo-element-colon-notation': 'double',

    // Disallow redundant longhand properties (use shorthand when possible)
    'declaration-block-no-redundant-longhand-properties': true,

    // Disallow redundant shorthand values (margin: 10px 10px → margin: 10px)
    'shorthand-property-no-redundant-values': true,

    // Prevent specificity conflicts
    'no-descending-specificity': true,

    // Disallow invalid hex colors
    'color-no-invalid-hex': true,

    // Limit complexity of compound selectors
    'selector-max-compound-selectors': 3,

    // Limit maximum nesting depth in SCSS
    'max-nesting-depth': 3,

    // Require a space after // comments
    'scss/double-slash-comment-whitespace-inside': 'always',

    // Disallow duplicate @import rules
    'no-duplicate-at-import-rules': true,

    // Ensure @import rules appear before other statements
    'no-invalid-position-at-import-rule': true,

    // Disallow empty rule blocks
    'block-no-empty': true,

    // Disallow unknown properties
    'property-no-unknown': [
      true,
      { ignoreProperties: ['corner-shape'], ignoreSelectors: [] },
    ],

    // Disallow unknown CSS units
    'unit-no-unknown': true,

    // Disallow unknown pseudo-classes
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'], // ✅ allow CSS Modules syntax
      },
    ],

    // Enforce lowercase for function names (rgb, linear-gradient)
    'function-name-case': 'lower',

    // Enforce kebab-case for custom SCSS mixin names
    'scss/at-mixin-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',

    // Enforce kebab-case for custom SCSS function names
    'scss/at-function-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',

    // Enforce kebab-case for SCSS placeholder names
    'scss/percent-placeholder-pattern': '^[a-z0-9]+(-[a-z0-9]+)*$',
  },

  overrides: [
    {
      files: ['**/*.module.scss'], // Only apply to CSS Modules
      rules: {
        // Enforce pure camelCase for CSS module class selectors
        'selector-class-pattern': [
          '^[a-z][a-zA-Z0-9]*$',
          {
            resolveNestedSelectors: true,
            message: (selectorValue) =>
              `Expected class selector "${selectorValue}" to use camelCase`,
          },
        ],
      },
    },
    {
      files: ['**/temp.css'], // Disable problematic rules for temp.css
      rules: {
        'scss/at-rule-no-unknown': null,
        'declaration-property-value-keyword-no-deprecated': null,
        'selector-class-pattern': null,
        'scss/selector-nest-combinators': null,
        'rule-empty-line-before': null,
      },
    },
  ],
}
