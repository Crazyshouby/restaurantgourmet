
import { Reservation } from '@/types';
import { GoogleCalendarService } from '../google-calendar';
import { ReservationDbService } from './db-service';

/**
 * Service pour la création de réservations
 */
export class ReservationCreationService {
  /**
   * Crée une nouvelle réservation avec synchronisation Google Calendar optionnelle
   */
  static async createReservation(reservation: Omit<Reservation, 'id' | 'googleEventId'> & { importedFromGoogle?: boolean }): Promise<Reservation> {
    try {
      // Vérifie si Google Calendar est connecté et si la réservation n'a pas déjà été importée de Google
      const isConnected = await GoogleCalendarService.isConnected();
      const importedFromGoogle = reservation.importedFromGoogle || false;
      
      let googleEventId = undefined;
      
      // Ne créer un événement dans Google Calendar que si:
      // 1. Google Calendar est connecté
      // 2. La réservation n'a pas été importée de Google Calendar (pour éviter les doublons)
      if (isConnected && !importedFromGoogle) {
        try {
          // Crée un événement dans Google Calendar
          const { success, eventId } = await GoogleCalendarService.createEvent(reservation);
          
          if (success && eventId) {
            googleEventId = eventId;
          }
        } catch (error) {
          console.error('Erreur lors de la création de l\'événement Google Calendar:', error);
        }
      }
      
      // Crée la réservation dans la base de données avec le flag importedFromGoogle
      return await ReservationDbService.createReservationInDatabase(
        reservation, 
        googleEventId,
        importedFromGoogle
      );
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  }
}
