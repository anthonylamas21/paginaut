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
      '155': '37rem', 
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
  },
  container: {
    center: true, // Centrar el contenedor horizontalmente
    padding: '1rem', // Establecer un relleno de 2rem (32px)
    screens: {
      sm: '640px', // Ancho mínimo para pantallas pequeñas
      md: '768px', // Ancho mínimo para pantallas medianas
      lg: '1024px', // Ancho mínimo para pantallas grandes
      xl: '1280px', // Ancho mínimo para pantallas extra grandes
    },
  },

},
  plugins: [
    require('preline/plugin'),
  ],
}