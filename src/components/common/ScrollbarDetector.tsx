
import { useEffect } from 'react';

const ScrollbarDetector = () => {
  useEffect(() => {
    // Fonction pour vérifier si le contenu dépasse et nécessite un défilement
    const checkScrollNeeded = () => {
      // Vérifier si le contenu dépasse la hauteur de la fenêtre
      if (document.body.scrollHeight > window.innerHeight) {
        document.documentElement.classList.add('scroll-active');
      } else {
        document.documentElement.classList.remove('scroll-active');
      }
    };

    // Vérifier immédiatement au chargement
    checkScrollNeeded();
    
    // Observer les mutations du DOM qui pourraient affecter la hauteur
    const resizeObserver = new ResizeObserver(() => {
      checkScrollNeeded();
    });
    
    // Observer le body pour détecter les changements de taille
    resizeObserver.observe(document.body);
    
    // Vérifier à chaque redimensionnement de fenêtre
    window.addEventListener('resize', checkScrollNeeded);
    
    // Vérifier après le chargement complet des images et autres ressources
    window.addEventListener('load', checkScrollNeeded);
    
    // Vérifier lors du défilement (peut être utile pour des chargements dynamiques)
    window.addEventListener('scroll', checkScrollNeeded);
    
    // Nettoyage des écouteurs d'événements
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScrollNeeded);
      window.removeEventListener('load', checkScrollNeeded);
      window.removeEventListener('scroll', checkScrollNeeded);
    };
  }, []);

  return null;
};

export default ScrollbarDetector;
