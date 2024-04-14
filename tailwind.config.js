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
      center: true,
      padding: '1rem',
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
    },
  },
  plugins: [],
}
