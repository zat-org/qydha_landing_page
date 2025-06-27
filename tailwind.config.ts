/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your brand colors - properly configured for dark mode
        brand: {
          // Navy blue scale - your main brand colors
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#2a2f5c', // Your secondary brand color
          800: '#1d2145', // Your primary brand color
          900: '#0f172a',
        },
        // Enhanced primary/accent colors
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Your accent color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Surface colors for adaptive backgrounds
        surface: {
          // Light mode
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
          // Dark mode (will be handled by dark: modifier)
        }
      },
      fontFamily: {
        sans: ['Alexandria', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(29, 33, 69, 0.1), 0 2px 4px -2px rgba(29, 33, 69, 0.1)',
        'brand-lg': '0 10px 15px -3px rgba(29, 33, 69, 0.1), 0 4px 6px -4px rgba(29, 33, 69, 0.1)',
        'glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-lg': '0 0 40px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, theme("colors.brand.800"), theme("colors.brand.700"))',
        'gradient-brand-light': 'linear-gradient(to bottom right, theme("colors.gray.50"), theme("colors.gray.100"))',
        'gradient-brand-dark': 'linear-gradient(to bottom right, theme("colors.gray.900"), theme("colors.gray.800"))',
        'gradient-accent': 'linear-gradient(to right, theme("colors.primary.500"), theme("colors.primary.600"))',
        'gradient-hero': 'linear-gradient(135deg, theme("colors.brand.800") 0%, theme("colors.brand.700") 50%, theme("colors.primary.600") 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'Alexandria, sans-serif',
          },
        },
      },
    },
  },
  plugins: [ ],
} 