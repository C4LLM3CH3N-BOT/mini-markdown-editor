import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import path from "node:path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@mini-markdown-rc/ast-parser": path.resolve(__dirname, "./packages/mini-markdown-ast-parser"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "element-plus": ["element-plus", "@element-plus/icons-vue"],
          "codemirror": [
            "@codemirror/state",
            "@codemirror/view",
            "@codemirror/commands",
            "@codemirror/language",
            "@codemirror/lang-markdown",
            "@lezer/highlight",
          ],
          "highlight": ["highlight.js"],
          "ast-parser": ["@mini-markdown-rc/ast-parser"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
