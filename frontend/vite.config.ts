import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Fix __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // same effect as path.resolve
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://spotify-clone-jquy.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
