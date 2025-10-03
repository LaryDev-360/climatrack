import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/risk":         { target: "http://localhost:8000", changeOrigin: true },
      "/forecast":     { target: "http://localhost:8000", changeOrigin: true },
      "/climatology":  { target: "http://localhost:8000", changeOrigin: true },
      "/probability":  { target: "http://localhost:8000", changeOrigin: true },
      "/health":       { target: "http://localhost:8000", changeOrigin: true },
    },
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
