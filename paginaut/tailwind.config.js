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
        'slg': '1200px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        'primary-color': '#043D3D',
        'secondary-color': '#04837B',
        'third-color': 'EDEDED',
        'table-header-color': '#04837B',
        'color': '#043D3D',
        'active-color': '#04837B',
        'danger-color': '#EF4444',
        'danger-hover-color': '#EF4444',
        'input-focus-color': '#000',
        'imagen-principal': "#F59E0B",
        'imagen-general': "#3B82F6 ",
        'archivos': "#6366F1",
        'reactivar': "#10B981",
        'detalles':'#60A5FA'
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
