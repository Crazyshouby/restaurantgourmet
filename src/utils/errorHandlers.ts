
/**
 * Gestionnaire global pour les erreurs React
 */
export const reactErrorHandler = (error: any) => {
  console.error('Erreur dans le rendu React:', error);
  
  // Afficher des détails supplémentaires pour faciliter le débogage
  if (error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  // Vous pourriez ajouter ici un mécanisme de notification ou d'analyse
  // Pour suivre les erreurs en production
};

/**
 * Configure les gestionnaires d'erreurs globaux pour l'application
 */
export const setupGlobalErrorHandlers = () => {
  // Pour les erreurs JavaScript générales
  window.addEventListener('error', reactErrorHandler);
  
  // Pour les promesses non gérées
  window.addEventListener('unhandledrejection', reactErrorHandler);
};
