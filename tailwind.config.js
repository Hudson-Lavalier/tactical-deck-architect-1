/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  				},
  				'type-grounding': 'var(--type-grounding)',
  				'type-system': 'var(--type-system)',
  				'type-adaptation': 'var(--type-adaptation)',
  				'term-bg': 'var(--term-bg)',
  				'term-panel': 'var(--term-bg-panel)',
  				'term-card': 'var(--term-bg-card)',
  				'term-border': 'var(--term-border)',
  				'term-border-hover': 'var(--term-border-hover)',
  				'term-text': 'var(--term-text)',
  				'term-dim': 'var(--term-text-dim)',
  				'term-faint': 'var(--term-text-faint)',
  				'term-purple': 'var(--term-purple)',
  				'term-green': 'var(--term-green)',
  				'term-blue': 'var(--term-blue)'
  				},
  		fontFamily: {
  				heading: ['var(--font-heading)'],
  				body: ['var(--font-body)'],
  				display: ['var(--font-display)'],
  				mono: ['var(--font-mono)']
  			},
  			fontSize: {
  				'ui-xl': ['var(--ui-text-xl)', { lineHeight: '1.2' }],
  				'ui-lg': ['var(--ui-text-lg)', { lineHeight: '1.3' }],
  				'ui-md': ['var(--ui-text-md)', { lineHeight: '1.5' }],
  				'ui-sm': ['var(--ui-text-sm)', { lineHeight: '1.5' }],
  				'ui-xs': ['var(--ui-text-xs)', { lineHeight: '1.4' }]
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
