const colors = require('../../colors')

module.exports = {
  'button-secondary-color-fg': {
    DEFAULT: colors.brand[700],
    dark: colors.dark[300],

    hover: {
      DEFAULT: colors.brand[800],
      dark: colors.dark[100],
    },
  },

  'button-secondary-color-bg': {
    DEFAULT: colors.white,
    dark: colors.dark[900],

    hover: {
      DEFAULT: colors.brand[50],
      dark: colors.dark[800],
    },
  },

  'button-secondary-color-border': {
    DEFAULT: colors.brand[300],
    dark: colors.dark[700],

    hover: {
      DEFAULT: colors.brand[300],
      dark: colors.dark[700],
    },
  },
}
