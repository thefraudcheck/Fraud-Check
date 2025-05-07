module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};