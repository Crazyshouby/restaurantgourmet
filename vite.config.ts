
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Permet l'accès depuis n'importe quelle adresse IP
    port: 8080,
    strictPort: false, // Permet de changer de port si 8080 est occupé
    open: true, // Ouvre automatiquement le navigateur
  },
  build: {
    // Optimisation pour la production
    minify: 'terser', // Utilise terser pour une meilleure minification
    sourcemap: mode === 'development', // Source maps uniquement en développement
    chunkSizeWarningLimit: 1000, // Augmente la limite d'avertissement pour les chunks
    rollupOptions: {
      output: {
        // Stratégie de fractionnement des chunks pour optimiser le chargement
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@/components/ui/index',
            'lucide-react',
            'sonner'
          ],
          'utils-date': ['date-fns', 'date-fns-tz']
        }
      }
    },
    terserOptions: {
      // Options pour minimiser davantage le code
      compress: {
        drop_console: mode === 'production', // Supprime les console.log en production
        drop_debugger: mode === 'production' // Supprime les debugger en production
      }
    }
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
  // Optimisation du cache
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'sonner']
  },
  // Fix for browserslist message
  // This will tell Vite to use the latest browserslist settings
  esbuild: {
    target: 'esnext',
  },
}));
