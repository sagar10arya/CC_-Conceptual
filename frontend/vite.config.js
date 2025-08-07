import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // Ensure correct paths for production
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure it builds to 'dist'
    assetsDir: "assets",
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.NODE_ENV === "production"
        ? "https://conceptual.onrender.com/api/v1"
        : "/api/v1"
    ),
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/v1/, ""),
      },
    },
  },
});