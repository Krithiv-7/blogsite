import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
        fontFamily: {
            sans: ['var(--font-sans)'],
            serif: ['var(--font-serif)'],
            mono: ['var(--font-mono)'],
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  		},
        // Add typography plugin customization if needed
        typography: ({ theme }: { theme: (path: string) => string }) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': 'hsl(var(--foreground))',
              '--tw-prose-headings': 'hsl(var(--foreground))',
              '--tw-prose-lead': 'hsl(var(--muted-foreground))',
              '--tw-prose-links': 'hsl(var(--primary))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-counters': 'hsl(var(--muted-foreground))',
              '--tw-prose-bullets': 'hsl(var(--border))',
              '--tw-prose-hr': 'hsl(var(--border))',
              '--tw-prose-quotes': 'hsl(var(--foreground))',
              '--tw-prose-quote-borders': 'hsl(var(--border))',
              '--tw-prose-captions': 'hsl(var(--muted-foreground))',
              '--tw-prose-code': 'hsl(var(--foreground))',
              '--tw-prose-pre-code': 'hsl(var(--muted-foreground))', // Use muted-foreground for code text
              '--tw-prose-pre-bg': 'hsl(var(--muted))', // Code block background
              '--tw-prose-th-borders': 'hsl(var(--border))',
              '--tw-prose-td-borders': 'hsl(var(--border))',

              // // Invert colors are automatically handled by the typography plugin's dark modifier,
              // // but we ensure they use our CSS variables.
              // '--tw-prose-invert-body': 'hsl(var(--foreground))',
              // '--tw-prose-invert-headings': 'hsl(var(--foreground))',
              // '--tw-prose-invert-lead': 'hsl(var(--muted-foreground))',
              // '--tw-prose-invert-links': 'hsl(var(--primary))',
              // '--tw-prose-invert-bold': 'hsl(var(--foreground))',
              // '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
              // '--tw-prose-invert-bullets': 'hsl(var(--border))',
              // '--tw-prose-invert-hr': 'hsl(var(--border))',
              // '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
              // '--tw-prose-invert-quote-borders': 'hsl(var(--border))',
              // '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
              // '--tw-prose-invert-code': 'hsl(var(--foreground))',
              // '--tw-prose-invert-pre-code': 'hsl(var(--secondary-foreground))', // Dark mode code block text
              // '--tw-prose-invert-pre-bg': 'hsl(var(--secondary))', // Dark mode code block background
              // '--tw-prose-invert-th-borders': 'hsl(var(--border))',
              // '--tw-prose-invert-td-borders': 'hsl(var(--border))',
            },
          },
           // Ensure dark mode typography uses the correct variables
           dark: {
             css: {
              '--tw-prose-body': 'hsl(var(--foreground))',
              '--tw-prose-headings': 'hsl(var(--foreground))',
              '--tw-prose-lead': 'hsl(var(--muted-foreground))',
              '--tw-prose-links': 'hsl(var(--primary))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-counters': 'hsl(var(--muted-foreground))',
              '--tw-prose-bullets': 'hsl(var(--border))',
              '--tw-prose-hr': 'hsl(var(--border))',
              '--tw-prose-quotes': 'hsl(var(--foreground))',
              '--tw-prose-quote-borders': 'hsl(var(--border))',
              '--tw-prose-captions': 'hsl(var(--muted-foreground))',
              '--tw-prose-code': 'hsl(var(--foreground))',
              '--tw-prose-pre-code': 'hsl(var(--secondary-foreground))',
              '--tw-prose-pre-bg': 'hsl(var(--secondary))',
              '--tw-prose-th-borders': 'hsl(var(--border))',
              '--tw-prose-td-borders': 'hsl(var(--border))',
            },
          },
        }),
  	}
  },
  plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/typography"), // Added typography plugin
    ],
} satisfies Config;
