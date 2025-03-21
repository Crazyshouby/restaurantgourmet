
import { ReservationService as ModularReservationService } from './reservation';

// Réexporte la version modulaire pour maintenir la compatibilité
export const ReservationService = ModularReservationService;

/**
 * @deprecated Ce fichier est maintenu pour la compatibilité.
 * Veuillez utiliser le module depuis 'src/services/reservation' à la place.
 */
