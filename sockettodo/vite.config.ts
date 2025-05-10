import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large libraries into separate chunks
          react: ["react", "react-dom"],
          mqtt: ["mqtt"], // Example: Split MQTT library
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000 KB
  },
});
