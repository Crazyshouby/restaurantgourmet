
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost", // Changé de "::" à "localhost"
    port: 3000, // Changé de 8080 à 3000 pour correspondre à l'URL attendue
    strictPort: true, // Force l'utilisation du port 3000
    open: true, // Ouvre automatiquement le navigateur
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
