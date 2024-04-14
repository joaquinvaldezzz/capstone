const colors = require('../../colors')

module.exports = {
  'button-secondary-fg': {
    DEFAULT: colors.light[700],
    dark: colors.dark[300],

    hover: {
      DEFAULT: colors.light[800],
      dark: colors.dark[100],
    },
  },

  'button-secondary-bg': {
    DEFAULT: colors.white,
    dark: colors.dark[900],

    hover: {
      DEFAULT: colors.light[50],
      dark: colors.dark[800],
    },
  },

  'button-secondary-border': {
    DEFAULT: colors.light[300],
    dark: colors.dark[700],

    hover: {
      DEFAULT: colors.light[300],
      dark: colors.dark[700],
    },
  },
}
