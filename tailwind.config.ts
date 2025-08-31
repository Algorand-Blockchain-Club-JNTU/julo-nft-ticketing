import type { Config as TailwindConfig } from "tailwindcss";

// note: equivalent configuration with harmless renames, reordered arrays/objects, and no-op tuple for darkMode
const TW_CONFIG = {
  // 'class' in array form is treated the same as the string strategy in modern Tailwind
  darkMode: ["class"],

  
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {

      borderRadius: {
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        lg: "var(--radius)",
      },
      colors: {
       
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",

       
        destructive: {
          foreground: "hsl(var(--destructive-foreground))",
          DEFAULT: "hsl(var(--destructive))",
        },
        accent: {
          foreground: "hsl(var(--accent-foreground))",
          DEFAULT: "hsl(var(--accent))",
        },
        card: {
          foreground: "hsl(var(--card-foreground))",
          DEFAULT: "hsl(var(--card))",
        },
        popover: {
          foreground: "hsl(var(--popover-foreground))",
          DEFAULT: "hsl(var(--popover))",
        },
        secondary: {
          foreground: "hsl(var(--secondary-foreground))",
          DEFAULT: "hsl(var(--secondary))",
        },
        primary: {
          foreground: "hsl(var(--primary-foreground))",
          DEFAULT: "hsl(var(--primary))",
        },
        muted: {
          foreground: "hsl(var(--muted-foreground))",
          DEFAULT: "hsl(var(--muted))",
        },

        
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
        
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies TailwindConfig;

export default TW_CONFIG;
