/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000010',
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00aa',
        'neon-gold': '#ffd700',
        'neon-violet': '#bb00ff',
        'neon-green': '#00ff44',
        'neon-red': '#ff2222',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f0ff, 0 0 20px #00f0ff60, 0 0 40px #00f0ff30',
        'neon-magenta': '0 0 10px #ff00aa, 0 0 20px #ff00aa60, 0 0 40px #ff00aa30',
        'neon-gold': '0 0 10px #ffd700, 0 0 20px #ffd70060',
        'neon-violet': '0 0 10px #bb00ff, 0 0 20px #bb00ff60',
        'neon-green': '0 0 10px #00ff44, 0 0 20px #00ff4460',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.3' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.5' },
          '97%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
