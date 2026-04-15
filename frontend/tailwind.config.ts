import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07070d",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(244,63,94,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(168,85,247,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
