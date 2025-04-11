const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",    // ✅ looks inside all your source files
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: colors.sky,  // Replaced 'lightBlue' with 'sky'
        warmGray: colors.stone, // Replaced 'warmGray' with 'stone'
        trueGray: colors.neutral, // Replaced 'trueGray' with 'neutral'
        coolGray: colors.gray, // Replaced 'coolGray' with 'gray'
        blueGray: colors.slate, // Replaced 'blueGray' with 'slate'
      },
    },
  },
  plugins: [],
};
