import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#1B0E2E',
          light: '#2A1745',
          deep: '#120A21',
        },
        cream: '#FFF8F0',
        ink: '#241536',
        coral: '#FF6B8B',
        gold: '#FFC857',
        violet: '#8B5CF6',
        sage: '#7FA588',
        sky: '#8FCBEB',
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['General Sans', 'sans-serif'],
      },
      backgroundImage: {
        'party-gradient':
          'radial-gradient(circle at 15% 20%, rgba(139,92,246,0.35), transparent 40%), radial-gradient(circle at 85% 15%, rgba(255,107,139,0.30), transparent 45%), radial-gradient(circle at 50% 90%, rgba(255,200,87,0.20), transparent 50%)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        openCard: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(-25deg)' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
