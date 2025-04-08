
import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  preloadLinks?: Array<Record<string, string>>;
  defaultTitle?: string;
}

/**
 * Hook personnalisé pour gérer les métadonnées SEO
 */
export const useSEO = ({
  title,
  description,
  keywords,
  preloadLinks = [],
  defaultTitle = "Reserv - Réservation de Restaurant"
}: SEOMetadata) => {
  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title;
    
    // Mettre à jour la description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    
    // Mettre à jour les mots-clés si fournis
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        const newMetaKeywords = document.createElement('meta');
        newMetaKeywords.setAttribute('name', 'keywords');
        newMetaKeywords.setAttribute('content', keywords);
        document.head.appendChild(newMetaKeywords);
      }
    }
    
    // Précharger les ressources importantes
    preloadLinks.forEach(linkData => {
      const link = document.createElement('link');
      Object.entries(linkData).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    });
    
    // Nettoyage lors du démontage du composant
    return () => {
      document.title = defaultTitle;
    };
  }, [title, description, keywords, preloadLinks, defaultTitle]);
};
