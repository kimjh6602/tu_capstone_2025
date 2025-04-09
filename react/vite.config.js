import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["jwt-decode"]
  },
  commonjsOptions: {
    transformMixedEsModules: true,
    requireReturnsDefault: "preferred"
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html")
      }
    }
  }
});
