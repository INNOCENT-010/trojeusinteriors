import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          deep: '#111111',
        },
        offwhite: {
          DEFAULT: '#F4EFE8',
          warm: '#EDE8E0',
          pure: '#FAF8F5',
        },
        brass: {
          DEFAULT: '#B8963E',
          light: '#D4AE58',
          dark: '#8A6E2A',
          muted: '#C9A84C',
        },
        warmgray: '#2A2A2A',
        muted: '#7A7570',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        wider: '0.15em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
