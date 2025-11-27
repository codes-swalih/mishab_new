import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // leave theme empty so default Tailwind tokens (colors, spacing, borders...) are available
  theme: {
    extend: {
      // put any small custom extensions here (optional)
    },
  },
  plugins: [],
};

export default config;
