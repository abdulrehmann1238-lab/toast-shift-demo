/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F7F6F2',
          surface: '#FFFFFF',
          'surface-subtle': '#F0EFE9',
          text: '#252822',
          'text-secondary': '#777970',
          sage: '#758775',
          'sage-soft': '#E9EFE8',
          'sage-dark': '#5D6E5D',
          terracotta: '#B87960',
          'terracotta-soft': '#F9EAE5',
          amber: '#C39B59',
          'amber-soft': '#F8F3E8',
          border: '#E8E6DF',
          'border-strong': '#D4D0C5',
          sidebar: '#282B27',
          'sidebar-secondary': '#A6AA9F',
          'sidebar-hover': '#353934',
          'sidebar-active': '#3C413B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(37, 40, 34, 0.04), 0 1px 2px rgba(37, 40, 34, 0.02)',
        'elevated': '0 4px 12px rgba(37, 40, 34, 0.06), 0 2px 4px rgba(37, 40, 34, 0.03)',
        'modal': '0 20px 40px -15px rgba(37, 40, 34, 0.15), 0 0 0 1px rgba(37, 40, 34, 0.05)',
      }
    },
  },
  plugins: [],
}

