const { fontFamily } = require('tailwindcss/defaultTheme')
const {
  backgroundVariables,
  blurs,
  borderVariables,
  boxShadows,
  buttonPrimaryErrorVariables,
  buttonPrimaryVariables,
  buttonSecondaryColorVariables,
  buttonSecondaryErrorVariables,
  buttonSecondaryVariables,
  buttonTertiary,
  buttonTertiaryColor,
  buttonTertiaryErrorVariables,
  colors,
  fontSizes,
  foregroundVariables,
  textVariables,
} = require('./untitled-ui')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{ts,tsx}', './src/pages/**/*.{ts,tsx}'],
  theme: {
    container: {
      screens: {
        lg: '1024px',
      },
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '2rem',
      },
    },
    blur: { ...blurs },
    boxShadow: { ...boxShadows },
    colors: { ...colors },
    fontSize: { ...fontSizes },
    extend: {
      colors: {
        ...textVariables,
        ...borderVariables,
        ...foregroundVariables,
        ...backgroundVariables,

        ...buttonPrimaryVariables,
        ...buttonSecondaryVariables,
        ...buttonSecondaryColorVariables,
        ...buttonTertiary,
        ...buttonTertiaryColor,
        ...buttonPrimaryErrorVariables,
        ...buttonSecondaryErrorVariables,
        ...buttonTertiaryErrorVariables,
      },
      data: {
        error: 'error="true"',
      },
      fontFamily: {
        sans: ['InterVariable', ...fontFamily.sans],
      },
      maxWidth: {
        90: '22.5rem',
      },
      spacing: {
        header: '4.5rem',
        'section-padding': 'calc(theme(spacing.header) + theme(spacing.16))',
        3.5: '0.875rem',
      },
    },
  },
  plugins: [],
}
