/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}',
  './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      height: {
        '155': '37rem', // Clase del carousel
      },
      fontFamily:{
        poppins: ['poppins', 'sans-serif']
      }
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}



