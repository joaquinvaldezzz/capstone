const colors = require('../../colors')

module.exports = {
  'button-tertiary-error-fg': {
    DEFAULT: colors.error[700],
    dark: colors.error[300],

    hover: {
      DEFAULT: colors.error[800],
      dark: colors.error[200],
    },
  },

  'button-tertiary-error-bg': {
    hover: {
      DEFAULT: colors.error[50],
      dark: colors.error[900],
    },
  },
}
