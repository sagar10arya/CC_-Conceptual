import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // Ensure correct paths for production
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure it builds to 'dist'
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "https://conceptual.onrender.com", // Use your deployed backend
        changeOrigin: true,
      },
    },
  },
});