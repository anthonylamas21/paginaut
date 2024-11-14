/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}',
    './node_modules/preline/preline.js',
  ],

  theme: {

    extend: {
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'mdx': '990px', 
        'lg': '1024px',
        'slg': '1120px',
        'xl': '1280px',
        '2xl': '1536px',
      },
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
        'danger-color': '#EF4444'
      },
      height: {
        '155': '37rem',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
    },
    keyframes: {
        'infinite-scroll': {
            from: { transform: 'translateX(0)' },
            to: { transform: 'translateX(-100%)' },
        }
    }   

  },
  plugins: [
    require('preline/plugin'),
  ],
}
