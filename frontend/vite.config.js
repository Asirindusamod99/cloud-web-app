import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        // In Docker: backend:8000  |  Local: localhost:8000
        target: process.env.VITE_BACKEND_HOST
          ? `http://${process.env.VITE_BACKEND_HOST}:8000`
          : "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
