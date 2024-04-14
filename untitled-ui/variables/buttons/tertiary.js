const colors = require('../../colors')

module.exports = {
  'button-tertiary-fg': {
    DEFAULT: colors.light[600],
    dark: colors.dark[400],

    hover: {
      DEFAULT: colors.light[700],
      dark: colors.dark[200],
    },
  },

  'button-tertiary-bg': {
    hover: {
      DEFAULT: colors.light[50],
      dark: colors.dark[800],
    },
  },
}
