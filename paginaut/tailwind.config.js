/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}',
  './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#003C3D',
        'primary-color-50': '#003C3D',
        'primary-color-90': '#003C3D',
        'table-header-color': '#04847C',
        'color': '#003C3D',
        'input-bord-color': '#EDEDED',
        'color-active': '#008779',
        'input-focus-color': '#000',
        'secondary-color': '#008779',
        'secondary-color-90': '#008779e6',
        'danger-color': '#EF4444',
    },
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



