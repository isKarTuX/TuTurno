import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      backgroundColor: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        overlay: 'var(--bg-overlay)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        accent: 'var(--text-accent)',
      },
      borderColor: {
        DEFAULT: 'var(--glass-border)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        logo: ['var(--font-logo)'],
        handwritten: ['var(--font-handwritten)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
        bounce: '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'phone-float': 'phoneFloat 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'logo-reveal': 'logo-reveal 0.8s var(--ease-out) forwards',
        'logo-glow': 'logo-glow 3s ease-in-out infinite',
        'logo-float': 'logo-float 4s ease-in-out infinite',
        'turn-flip': 'flip-in 0.4s var(--ease-bounce)',
        'turn-change': 'turn-number-change 0.3s var(--ease-out)',
        'reveal-up': 'scroll-reveal-up 0.7s var(--ease-out) forwards',
        'reveal-left': 'scroll-reveal-left 0.7s var(--ease-out) forwards',
        'reveal-right': 'scroll-reveal-right 0.7s var(--ease-out) forwards',
        'screen-slide-in': 'screenSlideIn 300ms var(--ease-out)',
        'screen-slide-out': 'screenSlideOut 200ms var(--ease-out)',
        'hero-logo': 'heroLogoReveal 0.8s var(--ease-out) forwards',
        'hero-shimmer': 'heroLogoShimmer 3s ease-in-out infinite',
        'badge-fade-in': 'badgeFadeIn 0.5s var(--ease-out) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        phoneFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0.3deg)' },
          '50%': { transform: 'translateY(-12px) rotate(0.5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px oklch(55% 0.15 280 / 0.4)' },
          '50%': { boxShadow: '0 0 40px oklch(55% 0.15 280 / 0.6)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'logo-reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
        },
        'logo-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px oklch(55% 0.15 280 / 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 35px oklch(55% 0.15 280 / 0.7))' },
        },
        'logo-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-4px) rotate(1deg)' },
          '75%': { transform: 'translateY(-2px) rotate(-1deg)' },
        },
        'flip-in': {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        'turn-number-change': {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scroll-reveal-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-reveal-left': {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scroll-reveal-right': {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        screenSlideIn: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        screenSlideOut: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(-30px)' },
        },
        heroLogoReveal: {
          '0%': { opacity: '0', filter: 'blur(8px)', transform: 'translateY(20px)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        heroLogoShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        badgeFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px oklch(55% 0.15 280 / 0.3)',
        'glow-lg': '0 0 60px oklch(55% 0.15 280 / 0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config
