import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "/srch-s25/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        fallback: resolve(__dirname, "index.html"), // this creates 404.html
      },
    },
  },
});
