/** @type {import('tailwindcss').Config} */
module.exports = {
  important: ".tailwind",
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting your styles
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    // other plugins...
  ],
};
