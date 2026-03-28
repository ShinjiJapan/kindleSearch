import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-us": {
        target: "https://www.amazon.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-us/, ""),
      },
      "/api": {
        target: "https://www.amazon.co.jp",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "build",
  },
  publicDir: "public",
});
