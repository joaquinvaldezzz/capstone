const colors = require('../../colors')

module.exports = {
  'button-primary-error-fg': {
    DEFAULT: colors.white,
    dark: colors.white,

    hover: {
      DEFAULT: colors.white,
      dark: colors.white,
    },
  },

  'button-primary-error-bg': {
    DEFAULT: colors.error[600],
    dark: colors.error[600],

    hover: {
      DEFAULT: colors.error[700],
      dark: colors.error[700],
    },
  },

  'button-primary-error-border': {
    DEFAULT: colors.error[600],
    dark: colors.error[600],

    hover: {
      DEFAULT: colors.error[700],
      dark: colors.error[700],
    },
  },
}
