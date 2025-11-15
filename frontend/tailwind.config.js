/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          primary: '#0A0A0B',
          secondary: '#141416',
          tertiary: '#1C1C1F',
          elevated: '#252528',
        },
        // Accent colors
        accent: {
          primary: '#FF7D29',
          secondary: '#FFA726',
          gold: '#FFB74D',
          glow: '#FF9147',
        },
        // Semantic colors
        success: '#4CAF50',
        warning: '#FFA726',
        danger: '#EF5350',
        info: '#42A5F5',
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B3',
          tertiary: '#6B6B70',
          disabled: '#3F3F42',
        },
        // Border colors
        border: {
          default: 'rgba(63, 63, 66, 0.5)',
          subtle: 'rgba(90, 90, 95, 0.3)',
          accent: 'rgba(255, 125, 41, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '2rem',        // 32px
        '4xl': '2.5rem',      // 40px
        '5xl': '3rem',        // 48px
      },
      spacing: {
        '18': '4.5rem',       // 72px
        '22': '5.5rem',       // 88px
        '30': '7.5rem',       // 120px
        '50': '12.5rem',      // 200px
      },
      backdropBlur: {
        '20': '20px',
        '24': '24px',
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
        'glass-elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 125, 41, 0.1)',
        'glass-accent': '0 8px 32px rgba(255, 125, 41, 0.2)',
        'glow-orange': '0 4px 12px rgba(255, 125, 41, 0.3)',
        'glow-orange-lg': '0 6px 20px rgba(255, 125, 41, 0.4), 0 0 30px rgba(255, 125, 41, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF7D29 0%, #FFA726 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgba(255, 125, 41, 0.1) 0%, rgba(20, 20, 22, 0.9) 100%)',
        'gradient-glow': 'radial-gradient(circle at top, rgba(255, 125, 41, 0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        '10': '10px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 125, 41, 0.6)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 125, 41, 0.9)' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulse 1.5s infinite',
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
