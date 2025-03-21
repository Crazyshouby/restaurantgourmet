
import { Reservation } from '@/types';
import { GoogleCalendarService } from '../google-calendar';
import { ReservationBaseService } from './base-service';

/**
 * Service pour la création de réservations
 */
export class ReservationCreationService {
  /**
   * Crée une nouvelle réservation avec synchronisation Google Calendar optionnelle
   */
  static async createReservation(reservation: Omit<Reservation, 'id' | 'googleEventId'>): Promise<Reservation> {
    try {
      // Vérifie si Google Calendar est connecté
      const isConnected = await GoogleCalendarService.isConnected();
      
      let googleEventId = undefined;
      
      if (isConnected) {
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
      
      // Crée la réservation dans la base de données
      return await ReservationBaseService.createReservationInDatabase(reservation, googleEventId);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  }
}
