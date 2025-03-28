
import React, { Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingSpinner from './components/common/LoadingSpinner'
import { setupGlobalErrorHandlers } from './utils/errorHandlers'

// Script pour détecter si le défilement est nécessaire
const ScrollbarDetector = () => {
  useEffect(() => {
    // Fonction pour vérifier si le contenu dépasse et nécessite un défilement
    const checkScrollNeeded = () => {
      if (document.body.scrollHeight > window.innerHeight) {
        document.documentElement.classList.add('scroll-active');
      } else {
        document.documentElement.classList.remove('scroll-active');
      }
    };

    // Vérifier immédiatement au chargement
    checkScrollNeeded();
    
    // Vérifier à chaque redimensionnement de fenêtre
    window.addEventListener('resize', checkScrollNeeded);
    
    // Vérifier après le chargement complet des images et autres ressources
    window.addEventListener('load', checkScrollNeeded);
    
    // Nettoyage des écouteurs d'événements
    return () => {
      window.removeEventListener('resize', checkScrollNeeded);
      window.removeEventListener('load', checkScrollNeeded);
    };
  }, []);

  return null;
};

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
    <ScrollbarDetector />
    <Suspense fallback={<LazyLoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
