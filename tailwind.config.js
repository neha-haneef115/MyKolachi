/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // ✅ include src folder if you use it
  ],
  theme: {
    extend: {
      keyframes: {
        glitch: {
          "0%": { clipPath: "inset(20% 0 50% 0)" },
          "5%": { clipPath: "inset(10% 0 60% 0)" },
          "10%": { clipPath: "inset(15% 0 55% 0)" },
          "15%": { clipPath: "inset(25% 0 35% 0)" },
          "20%": { clipPath: "inset(30% 0 40% 0)" },
          "25%": { clipPath: "inset(40% 0 20% 0)" },
          "30%": { clipPath: "inset(10% 0 60% 0)" },
          "35%": { clipPath: "inset(15% 0 55% 0)" },
          "40%": { clipPath: "inset(25% 0 35% 0)" },
          "45%": { clipPath: "inset(30% 0 40% 0)" },
          "50%": { clipPath: "inset(20% 0 50% 0)" },
          "55%": { clipPath: "inset(10% 0 60% 0)" },
          "60%": { clipPath: "inset(15% 0 55% 0)" },
          "65%": { clipPath: "inset(25% 0 35% 0)" },
          "70%": { clipPath: "inset(30% 0 40% 0)" },
          "75%": { clipPath: "inset(40% 0 20% 0)" },
          "80%": { clipPath: "inset(20% 0 50% 0)" },
          "85%": { clipPath: "inset(10% 0 60% 0)" },
          "90%": { clipPath: "inset(15% 0 55% 0)" },
          "95%": { clipPath: "inset(25% 0 35% 0)" },
          "100%": { clipPath: "inset(30% 0 40% 0)" }
        }
      },
      animation: {
        "glitch-after": "glitch 2s infinite linear alternate-reverse",
        "glitch-before": "glitch 1.5s infinite linear alternate-reverse",
      },
    },
  },
  safelist: [
    'after:animate-glitch-after',
    'before:animate-glitch-before',
    'animate-glitch-after',
    'animate-glitch-before',
    'bg-[#060010]',
  ], // ✅ ensures dynamic pseudo classes aren’t purged
  plugins: [],
}
