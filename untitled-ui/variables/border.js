const colors = require('../colors')

module.exports = {
  'primary-border': {
    DEFAULT: colors.light[300],
    dark: colors.dark[700],
  },

  'secondary-border': {
    DEFAULT: colors.light[200],
    dark: colors.dark[800],
  },

  'tertiary-border': {
    DEFAULT: colors.light[100],
    dark: colors.dark[800],
  },

  'disabled-border': {
    DEFAULT: colors.light[300],
    dark: colors.dark[700],

    subtle: {
      DEFAULT: colors.light[200],
      dark: colors.dark[800],
    },
  },

  'brand-border': {
    DEFAULT: colors.brand[300],
    dark: colors.brand[400],
  },

  'brand-border-solid': {
    DEFAULT: colors.brand[600],
    dark: colors.brand[500],

    alt: {
      DEFAULT: colors.brand[600],
      dark: colors.dark[700],
    },
  },

  'error-border': {
    DEFAULT: colors.error[300],
    dark: colors.error[400],

    solid: {
      DEFAULT: colors.error[500],
      dark: colors.error[600],
    },
  },
}
