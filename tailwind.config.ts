import type { Config } from 'tailwindcss'
import files from './files'
import { blurs, boxShadows, colors, fontSizes } from './untitled-ui'

export default {
  content: [...files],
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
