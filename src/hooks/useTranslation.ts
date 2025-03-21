
import { useState, useCallback, useMemo } from "react";

// Types pour les traductions
type Translations = Record<string, Record<string, string>>;

// Traductions par défaut
const defaultTranslations: Translations = {
  fr: {
    // Erreurs
    "error.title": "Erreur",
    "error.generic": "Une erreur est survenue",
    "error.loading": "Erreur lors du chargement des données",
    "error.save": "Erreur lors de l'enregistrement",
    "error.delete": "Erreur lors de la suppression",
    
    // Succès
    "success.save": "Enregistré avec succès",
    "success.delete": "Supprimé avec succès",
    "success.google.sync": "Synchronisation réussie",
    
    // Actions
    "action.save": "Enregistrer",
    "action.cancel": "Annuler",
    "action.delete": "Supprimer",
    "action.edit": "Modifier",
    "action.add": "Ajouter",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.admin": "Administration",
    
    // Réservations
    "reservation.title": "Réservations",
    "reservation.empty": "Aucune réservation pour le moment",
    "reservation.guests": "personne | personnes",
    "reservation.date": "Date",
    "reservation.time": "Heure",
    "reservation.name": "Nom",
    "reservation.email": "Email",
    "reservation.phone": "Téléphone",
    "reservation.notes": "Notes",
    
    // Google Calendar
    "google.title": "Google Calendar",
    "google.connect": "Connecter Google Calendar",
    "google.disconnect": "Déconnecter Google Calendar",
    "google.sync": "Synchroniser avec Google",
    "google.import": "Importer depuis Google",
  },
  en: {
    // Add English translations here if needed
  }
};

export function useTranslation(initialLocale = "fr") {
  const [locale, setLocale] = useState(initialLocale);
  const [customTranslations, setCustomTranslations] = useState<Translations>({});
  
  // Combine default and custom translations
  const translations = useMemo(() => {
    return {
      ...defaultTranslations,
      ...customTranslations
    };
  }, [customTranslations]);
  
  // Translate a key
  const t = useCallback(
    (key: string, count?: number): string => {
      const translation = translations[locale]?.[key];
      
      if (!translation) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      
      // Handle pluralization
      if (count !== undefined && translation.includes(" | ")) {
        const [singular, plural] = translation.split(" | ");
        return count === 1 ? singular : plural;
      }
      
      return translation;
    },
    [locale, translations]
  );
  
  // Add custom translations
  const addTranslations = useCallback(
    (locale: string, newTranslations: Record<string, string>) => {
      setCustomTranslations((prev) => ({
        ...prev,
        [locale]: {
          ...(prev[locale] || {}),
          ...newTranslations,
        },
      }));
    },
    []
  );
  
  return {
    t,
    locale,
    setLocale,
    addTranslations,
  };
}
