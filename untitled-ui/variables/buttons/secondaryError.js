const colors = require('../../colors')

module.exports = {
  'button-secondary-error-fg': {
    DEFAULT: colors.error[700],
    dark: colors.error[200],

    hover: {
      DEFAULT: colors.error[800],
      dark: colors.error[100],
    },
  },

  'button-secondary-error-bg': {
    DEFAULT: colors.white,
    dark: colors.error[950],

    hover: {
      DEFAULT: colors.error[50],
      dark: colors.error[900],
    },
  },

  'button-secondary-error-border': {
    DEFAULT: colors.error[300],
    dark: colors.error[800],

    hover: {
      DEFAULT: colors.error[300],
      dark: colors.error[700],
    },
  },
}
