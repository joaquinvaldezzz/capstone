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
      maxWidth: {
        90: '22.5rem',
      },
      spacing: {
        3.5: '0.875rem',
      },
    },
  },
  plugins: [],
}
