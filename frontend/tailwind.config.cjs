module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: { 50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
        cyan: { 50: '#ecfeff', 600: '#0891b2', 700: '#0e7490', 800: '#155e75' }
      }
    }
  },
  plugins: []
};
