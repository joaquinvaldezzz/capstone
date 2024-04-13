const config = {
  plugins: {
    '@fullhuman/postcss-purgecss': process.env.NODE_ENV === 'production' && {
      content: ['./src/components/**/*.{ts,tsx,md,mdx}', './src/pages/**/*.{ts,tsx,md,mdx}'],
      defaultExtractor: (content) => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]+/g) || []
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]+/g) || []
        return broadMatches.concat(innerMatches)
      },
      keyframes: true,
      variables: true,
      safelist: ['html', 'body'],
    },
    autoprefixer: {},
    'postcss-import': {},
    'postcss-sort-media-queries': {},
    tailwindcss: {},
  },
}

export default config
