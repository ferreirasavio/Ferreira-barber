/// <reference types="vitest" />
import react from "@vitejs/plugin-react"; // Exemplo para um projeto React
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Outras configurações do Vitest, como environment e setupFiles
  },
});
