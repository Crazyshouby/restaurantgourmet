
/**
 * @deprecated Ce fichier est maintenu pour la compatibilité. 
 * Veuillez utiliser le module depuis 'src/services/google-calendar' à la place.
 */

import { GoogleCalendarService } from './google-calendar';

// Réexporte la classe complète pour maintenir la compatibilité
export { GoogleCalendarService };

// Réexporte également les types
export type {
  GoogleCalendarSettings,
  GoogleCalendarEvent,
  GoogleCalendarAuthResponse,
  GoogleCalendarEventResponse
} from './google-calendar';
