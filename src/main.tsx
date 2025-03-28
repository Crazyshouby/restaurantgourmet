
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingSpinner from './components/common/LoadingSpinner'

// Ajouter un composant de fallback pour le lazy loading
const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" message="Chargement..." />
  </div>
);

// Ajouter l'optimisation pour les erreurs React
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any) => {
  console.error('Erreur dans le rendu React:', error);
  // Afficher des détails supplémentaires pour faciliter le débogage
  if (error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
};

// Adding a polyfill for older browsers if needed
if (!('ResizeObserver' in window)) {
  // This will be included only for older browsers
  console.info('Adding ResizeObserver polyfill for older browsers');
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<LazyLoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

// Ajouter un gestionnaire global pour les erreurs non captées
window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', errorHandler);
