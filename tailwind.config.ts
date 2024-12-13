import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: {
		files: [
			'./pages/**/*.{ts,tsx}',
			'./components/**/*.{ts,tsx}',
			'./app/**/*.{ts,tsx}',
			'./src/**/*.{ts,tsx,html,js}',
		],
		relative: true,
		transform: (content: string) => content.replace(/taos:/g, ''),
	},
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			boxShadow: {
				custom: '0px 0px 10px 0px rgba(0, 0, 0, 0.25)'
			},
			screens: {
				'customxl': '1440px'
			},
			spacing: {
				L: '20px',
				XXL: '40px'
			},
			colors: {
				platinum: 'hsl(240, 5%, 88%)',
				platinum_950: '#161618',
				text_2: '#2C2C2F',
				yellow: '#FCA420',
				crimsonNew: '#80030E',
				jordanium: '#dedee0',
				oxfordBlueNew: '#0A173B',
				oxfordBlue: 'hsl(219, 66%, 15%)',
				frenchGray: 'hsl(210, 9%, 74%)',
				rowHouse: 'hsl(30, 10%, 70%)',
				crimson: 'hsl(356, 100%, 25%)',
				navyYellow: 'hsl(45, 100%, 50%)',
				ivory: 'hsl(60, 100%, 97%)',
				steelBlue: 'hsl(207, 44%, 49%)',
				sageGreen: 'hsl(85, 18%, 60%)',
				charcoalGray: 'hsl(204, 19%, 26%)',
				sunsetOrange: 'hsl(3, 98%, 66%)',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				row_house: '#C0B7AD',
				background_bg_a: '#FFF',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				backgoundPlatinum: '#DEDEE0',
				cardBackground: '#fbfbfb',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				opsan: ['Open Sans'],
				opensans: ['Open Sans', 'sans-serif'],
				oswald: ['Oswald', 'sans-serif'],
				lexendDeca: ['Lexend Deca', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				courseNavbarRadius: '0px, 0px, 0px, 3px',
				custom_lg: '16px'
			},
			lineHeight: {
				'6': '24px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards'
			},
			placeholderColor: {
				primary: 'hsl(var(--primary))',
				secondary: 'hsl(var(--secondary))'
			}
		},
		listStyleType: {
			none: 'none',
			disc: 'disc',
			decimal: 'decimal',
			square: 'square',
			roman: 'upper-roman',
			lowerAlpha: 'lower-alpha',
			upperAlpha: 'upper-alpha'
		}
	},
	variants: {
		extend: {
			opacity: ["responsive", "hover", "focus", "disabled"],
			placeholderColor: ["focus"],
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require('taos/plugin')
	],
	safelist: [
		'!duration-[0ms]',
		'!delay-[0ms]',
		'html.js :where([class*="taos:"]:not(.taos-init))'
	],
} satisfies Config

export default config
