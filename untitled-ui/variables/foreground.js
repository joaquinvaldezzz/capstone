const colors = require('../colors')

module.exports = {
  'primary-fg': {
    DEFAULT: colors.light[900],
    dark: colors.white,
  },

  'secondary-fg': {
    DEFAULT: colors.light[700],
    dark: colors.dark[300],

    hover: {
      DEFAULT: colors.light[800],
      dark: colors.dark[200],
    },
  },

  'tertiary-fg': {
    DEFAULT: colors.light[600],
    dark: colors.dark[400],

    hover: {
      DEFAULT: colors.light[700],
      dark: colors.dark[300],
    },
  },

  'quarterary-fg': {
    DEFAULT: colors.light[500],
    dark: colors.dark[400],

    hover: {
      DEFAULT: colors.light[600],
      dark: colors.dark[300],
    },
  },

  'quinary-fg': {
    DEFAULT: colors.light[400],
    dark: colors.dark[500],

    hover: {
      DEFAULT: colors.light[500],
      dark: colors.dark[400],
    },
  },

  'senary-fg': {
    DEFAULT: colors.light[300],
    dark: colors.dark[600],
  },

  'white-fg': {
    DEFAULT: colors.white,
    dark: colors.white,
  },

  'disabled-fg': {
    DEFAULT: colors.light[400],
    dark: colors.dark[500],

    subtle: {
      DEFAULT: colors.light[300],
      dark: colors.dark[600],
    },
  },

  'brand-primary-fg': {
    DEFAULT: colors.brand[600],
    dark: colors.brand[500],

    alt: {
      DEFAULT: colors.brand[600],
      dark: colors.dark[300],
    },
  },

  'brand-secondary-fg': {
    DEFAULT: colors.brand[500],
    dark: colors.brand[500],
  },

  'error-primary-fg': {
    DEFAULT: colors.error[600],
    dark: colors.error[500],
  },

  'error-secondary-fg': {
    DEFAULT: colors.error[500],
    dark: colors.error[400],
  },

  'warning-primary-fg': {
    DEFAULT: colors.warning[600],
    dark: colors.warning[500],
  },

  'warning-secondary-fg': {
    DEFAULT: colors.warning[500],
    dark: colors.warning[400],
  },

  'success-primary-fg': {
    DEFAULT: colors.success[600],
    dark: colors.success[500],
  },

  'success-secondary-fg': {
    DEFAULT: colors.success[500],
    dark: colors.success[400],
  },
}
