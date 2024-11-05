// vite.config.js en la raíz del proyecto
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/WebScraping-Project/", // Debe coincidir con el nombre de tu repositorio
});
