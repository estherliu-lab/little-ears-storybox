import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.PUBLIC_BASE ?? (process.env.GITHUB_PAGES === "true" ? "/little-ears-storybox/" : "/"),
  plugins: [react()],
  server: {
    port: 5173,
  },
});
