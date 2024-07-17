/** @type {import('tailwindcss').Config} */
export default {
  build: {
    rollupOptions: {
      external: ['uuid']
    }
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter':['Inter', 'sans-serif'],
        'Poppins':['Poppins', 'sans-serif']
      },
      transform: {
        'flip-up': 'rotateX(180deg)',
      },
      colors: {
        // Review panel
        LogoText: 'var(--color-LogoText)',
        NavBar: 'var(--color-NavBar)',
        NavBarText: 'var(--color-NavBarText)',
        SideBar: 'var(--color-SideBar)',
        iconColor: 'var(--color-iconColor)',
        iconHover: 'var(--color-iconHover)',
        sidbarText: 'var(--color-sidbarText)',
        sidbarHead: 'var(--color-sidbarHead)',
        background: 'var(--color-background)',
        SelectedNav: 'var(--color-SelectedNav)',
        
        ReceptionLogoText: 'var(--color-ReceptionLogoText)',
        ReceptionNavBar: 'var(--color-ReceptionNavBar)',
        ReceptionNavBarText: 'var(--color-ReceptionNavBarText)',
        ReceptionSideBar: 'var(--color-ReceptionSideBar)',
        ReceptioniconColor: 'var(--color-ReceptioniconColor)',
        ReceptioniconHover: 'var(--color-ReceptioniconHover)',
        ReceptionsidbarText: 'var(--color-ReceptionsidbarText)',
        ReceptionsidbarHead: 'var(--color-ReceptionsidbarHead)',
        Receptionbackground: 'var(--color-Receptionbackground)',
        ReceptionSelectedNav: 'var(--color-ReceptionSelectedNav)',
        
      },
      
    },
    screens: {
      xs: "320px", // Extra small screens and up
      sm: "660px", // Small screens and up
      md: "768px", // Medium screens and up
      lg: "1020px", // Large screens and up
      xl: "1250px", // Extra large screens and up
      "2xl": "1440px", // 2 Extra large screens and up
      "3xl": "1800px", // 2 Extra large screens and up
      "4xl": "2500px", // 2 Extra large screens and up

      //addons
      xs1: "486px",
      md1: "820px",
    },
  },
  variants: {
    extend: {
      transform: ['hover', 'focus'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.transform-flip-up': {
          transform: 'rotateY(180deg)',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}