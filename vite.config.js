import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("firebase"))              return "vendor-firebase";
          if (id.includes("@google/generative-ai")) return "vendor-ai";
          if (id.includes("lucide-react") || id.includes("react-hot-toast")) return "vendor-ui";
          if (id.includes("node_modules"))          return "vendor-react";
        },
      },
    },
  },
});
