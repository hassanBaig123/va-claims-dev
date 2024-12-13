import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        platinum: 'hsl(240, 5%, 88%)',
        oxfordBlue: 'hsl(219, 66%, 15%)',
        frenchGray: 'hsl(210, 9%, 74%)',
        rowHouse: 'hsl(30, 10%, 70%)',
        crimson: 'hsl(356, 100%, 25%)',
        navyYellow: 'hsl(45, 100%, 50%)',
        // Optional colors
        ivory: 'hsl(60, 100%, 97%)',
        steelBlue: 'hsl(207, 44%, 49%)', 
        sageGreen: 'hsl(85, 18%, 60%)',
        charcoalGray: 'hsl(204, 19%, 26%)',
        sunsetOrange: 'hsl(3, 98%, 66%)', 
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        courseNavbarRadius: "0px, 0px, 0px, 3px"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      placeholderColor: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // Add other placeholder colors as needed
      }
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
      lowerAlpha: 'lower-alpha',
      upperAlpha: 'upper-alpha',
    },
  },
  variants: {
    extend: {
      opacity: ["responsive", "hover", "focus", "disabled"],
      placeholderColor: ["focus"],
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config