import type { Config } from 'tailwindcss'
import { blurs, boxShadows, colors, fontSizes } from './untitled-ui'

export default {
  content: ['./src/components/**/*.{ts,tsx,md,mdx}', './src/pages/**/*.{ts,tsx,md,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    blur: {
      ...blurs,
    },
    boxShadow: {
      ...boxShadows,
    },
    colors: {
      ...colors,
    },
    fontSize: {
      ...fontSizes,
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
