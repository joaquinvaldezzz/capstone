const colors = require('../colors')

module.exports = {
  'primary-bg': {
    DEFAULT: colors.light[25],
    dark: colors.dark[950],

    alt: {
      DEFAULT: colors.light[25],
      dark: colors.dark[900],
    },

    hover: {
      DEFAULT: colors.light[50],
      dark: colors.light[800],
    },

    solid: {
      DEFAULT: colors.light[950],
      dark: colors.dark[900],
    },
  },

  'secondary-bg': {
    DEFAULT: colors.light[50],
    dark: colors.dark[900],

    alt: {
      DEFAULT: colors.light[50],
      dark: colors.light[25],
    },

    hover: {
      DEFAULT: colors.light[100],
      dark: colors.dark[800],
    },

    subtle: {
      DEFAULT: colors.light[25],
      dark: colors.dark[900],
    },

    solid: {
      DEFAULT: colors.light[600],
      dark: colors.dark[600],
    },
  },

  'tertiary-bg': {
    DEFAULT: colors.light[100],
    dark: colors.dark[800],
  },

  'quatermary-bg': {
    DEFAULT: colors.light[200],
    dark: colors.dark[700],
  },

  'active-bg': {
    DEFAULT: colors.light[50],
    dark: colors.dark[800],
  },

  'disabled-bg': {
    DEFAULT: colors.light[50],
    dark: colors.dark[900],

    subtle: {
      DEFAULT: colors.light[50],
      dark: colors.dark[900],
    },
  },

  'overlay-bg': {
    DEFAULT: colors.light[950],
    dark: colors.dark[800],
  },

  'brand-primary-bg': {
    DEFAULT: colors.brand[50],
    dark: colors.brand[500],

    alt: {
      DEFAULT: colors.brand[50],
      dark: colors.brand[900],
    },
  },

  'brand-secondary-bg': {
    DEFAULT: colors.brand[100],
    dark: colors.brand[600],
  },

  'brand-solid-bg': {
    DEFAULT: colors.brand[600],
    dark: colors.brand[600],

    hover: {
      DEFAULT: colors.brand[700],
      dark: colors.brand[500],
    },
  },

  'brand-section-bg': {
    DEFAULT: colors.brand[800],
    dark: colors.brand[900],

    subtle: {
      DEFAULT: colors.brand[700],
      dark: colors.brand[25],
    },
  },

  'error-bg': {
    primary: {
      DEFAULT: colors.error[50],
      dark: colors.error[500],
    },

    secondary: {
      DEFAULT: colors.error[700],
      dark: colors.error[600],
    },

    solid: {
      DEFAULT: colors.error[600],
      dark: colors.error[600],
    },
  },

  'warning-bg': {
    primary: {
      DEFAULT: colors.warning[50],
      dark: colors.warning[500],
    },

    secondary: {
      DEFAULT: colors.warning[100],
      dark: colors.warning[600],
    },

    solid: {
      DEFAULT: colors.warning[600],
      dark: colors.warning[600],
    },
  },

  'success-bg': {
    primary: {
      DEFAULT: colors.success[50],
      dark: colors.success[500],
    },

    secondary: {
      DEFAULT: colors.success[100],
      dark: colors.success[600],
    },

    solid: {
      DEFAULT: colors.success[600],
      dark: colors.success[600],
    },
  },
}
