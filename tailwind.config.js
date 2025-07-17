/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./pages/*.html",
    "./src/js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-green': '#00ff41',
        'cyber-blue': '#00d4ff',
        'cyber-purple': '#8b5cf6',
        'cyber-red': '#ff0040',
        'cyber-gray': '#1a1a1a',
        'cyber-light': '#f0f0f0',
        'matrix-green': '#00ff41',
        'terminal-bg': '#0c0c0c',
        'terminal-green': '#00ff00',
        'neon-blue': '#00ffff',
        'neon-pink': '#ff00ff',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        'tech': ['Orbitron', 'Exo 2', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(30, end), blink-caret .5s step-end infinite',
        'matrix-rain': 'matrix-rain 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 'text-shadow': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41' },
          '100%': { 'text-shadow': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41' }
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 65, 0.5)',
        'neon': '0 0 30px rgba(0, 255, 255, 0.7)',
        'terminal': '0 0 15px rgba(0, 255, 0, 0.3)',
      }
    },
  },
  plugins: [],
} 