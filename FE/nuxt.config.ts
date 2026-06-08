import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/style/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});