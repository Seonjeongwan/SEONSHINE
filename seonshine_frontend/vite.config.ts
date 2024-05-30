import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 4000,
    host: true,
  },
  build: {
    outDir: "./build",
    rollupOptions: {
      output: {
        entryFileNames: "entries/[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    chunkSizeWarningLimit: 700,
  },
  base: "./",
  plugins: [
    react({
      tsDecorators: true,
    }),
    svgr(),
    {
      name: "eslint",
      enforce: "pre",
      apply: "serve",
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
});
