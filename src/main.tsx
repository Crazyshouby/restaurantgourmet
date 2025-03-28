
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingSpinner from './components/common/LoadingSpinner'
import { setupGlobalErrorHandlers } from './utils/errorHandlers'

// Ajouter un composant de fallback pour le lazy loading
const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" message="Chargement..." />
  </div>
);

// Adding a polyfill for older browsers if needed
if (!('ResizeObserver' in window)) {
  // This will be included only for older browsers
  console.info('Adding ResizeObserver polyfill for older browsers');
}

// Configurer les gestionnaires d'erreurs globaux
setupGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<LazyLoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
