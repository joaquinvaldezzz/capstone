const colors = require("../colors")

module.exports = {
  primary: {
    DEFAULT: colors.light[900],
    dark: colors.dark[50],

    "on-brand": {
      DEFAULT: colors.white,
      dark: colors.dark[50],
    },
  },

  secondary: {
    DEFAULT: colors.light[700],
    dark: colors.dark[300],

    hover: {
      DEFAULT: colors.light[800],
      dark: colors.dark[200],
    },

    "on-brand": {
      DEFAULT: colors.brand[200],
      dark: colors.dark[300],
    },
  },

  tertiary: {
    DEFAULT: colors.light[600],
    dark: colors.dark[400],

    hover: {
      DEFAULT: colors.light[700],
      dark: colors.dark[300],
    },

    "on-brand": {
      DEFAULT: colors.brand[200],
      dark: colors.dark[400],
    },
  },

  quarterary: {
    DEFAULT: colors.light[500],
    dark: colors.dark[400],

    "on-brand": {
      DEFAULT: colors.brand[300],
      dark: colors.dark[400],
    },
  },

  disabled: {
    DEFAULT: colors.light[500],
    dark: colors.dark[500],
  },

  placeholder: {
    DEFAULT: colors.light[500],
    dark: colors.dark[500],

    subtle: {
      DEFAULT: colors.light[300],
      dark: colors.dark[700],
    },
  },

  "brand-primary": {
    DEFAULT: colors.brand[900],
    dark: colors.dark[50],
  },

  "brand-secondary": {
    DEFAULT: colors.brand[700],
    dark: colors.dark[300],
  },

  "brand-tertiary": {
    DEFAULT: colors.brand[600],
    dark: colors.dark[400],

    alt: {
      DEFAULT: colors.brand[600],
      dark: colors.dark[50],
    },
  },

  "error-primary": {
    DEFAULT: colors.error[600],
    dark: colors.error[400],
  },

  "warning-primary": {
    DEFAULT: colors.warning[600],
    dark: colors.warning[400],
  },

  "success-primary": {
    DEFAULT: colors.success[600],
    dark: colors.success[50],
  },
}
