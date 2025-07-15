// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4',      // cyan-500
        primaryDark: '#0891b2',  // cyan-600
        success: '#22c55e',      // green-500
      },
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
      },
      backgroundImage: {
        'main-pattern': "url('background1.jpg')",
      },
    },
  },
  plugins: [],
};
