import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import { blurs, boxShadows, colors } from './theme'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      screens: {
        xl: '1280px',
      },
      center: true,
      padding: {
        DEFAULT: '1rem',
        xl: '2rem',
      },
    },
    blur: { ...blurs },
    boxShadow: { ...boxShadows },
    colors: { ...colors },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.125rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      md: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.875rem' }],
      'display-xs': ['1.5rem', { lineHeight: '2rem' }],
      'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
      'display-md': ['2.25rem', { lineHeight: '2.75rem' }],
      'display-lg': ['3rem', { lineHeight: '3.75rem' }],
      'display-xl': ['3.75rem', { lineHeight: '4.5rem' }],
      'display-2xl': ['4.5rem', { lineHeight: '5.625rem' }],
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      aria: {
        invalid: 'invalid="true"',
      },
      content: {
        'open-quote': 'open-quote',
        'close-quote': 'close-quote',
      },
      data: {
        checked: 'state="checked"',
        open: 'state="open"',
        closed: 'state="closed"',
        active: 'state="active"',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'slide-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      ringWidth: {
        6: '6px',
      },
      spacing: {
        'header-height': 'var(--header-height)',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        15: '3.75rem',
        18: '4.5rem',
        120: '30rem',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
    }),

    require('tailwindcss-animate'),
  ],
}

export default config
