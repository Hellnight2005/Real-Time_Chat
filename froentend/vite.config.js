import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Backend server URL
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "http://localhost:5000", // Backend URL for Socket.IO
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
