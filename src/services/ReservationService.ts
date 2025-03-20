
import { GoogleCalendarService } from './GoogleCalendarService';
import { Reservation } from '@/types';

// Ce service est une simulation qui sera remplacé par l'intégration réelle avec Supabase
export class ReservationService {
  // Récupère toutes les réservations
  static async getReservations(): Promise<Reservation[]> {
    // Simuler un appel à Supabase
    const reservationsJson = localStorage.getItem('reservations');
    const reservations = reservationsJson ? JSON.parse(reservationsJson) : [];
    
    return reservations.map((r: any) => ({
      ...r,
      date: new Date(r.date)
    }));
  }

  // Crée une nouvelle réservation
  static async createReservation(reservation: Omit<Reservation, 'id' | 'googleEventId'>): Promise<Reservation> {
    // Génère un ID aléatoire
    const id = 'res_' + Math.random().toString(36).substring(2, 11);
    
    const newReservation: Reservation = {
      ...reservation,
      id,
      googleEventId: undefined
    };
    
    // Vérifie si Google Calendar est connecté
    const isConnected = await GoogleCalendarService.isConnected();
    
    if (isConnected) {
      try {
        // Crée un événement dans Google Calendar
        const { success, eventId } = await GoogleCalendarService.createEvent(newReservation);
        
        if (success && eventId) {
          newReservation.googleEventId = eventId;
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'événement Google Calendar:', error);
      }
    }
    
    // Simuler l'enregistrement dans Supabase
    const existingReservationsJson = localStorage.getItem('reservations');
    const existingReservations = existingReservationsJson ? JSON.parse(existingReservationsJson) : [];
    
    const updatedReservations = [...existingReservations, newReservation];
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    
    return newReservation;
  }

  // Synchronise les réservations existantes avec Google Calendar
  static async syncWithGoogleCalendar(): Promise<{ success: boolean; syncedCount: number }> {
    const isConnected = await GoogleCalendarService.isConnected();
    
    if (!isConnected) {
      return { success: false, syncedCount: 0 };
    }
    
    // Récupère toutes les réservations
    const reservations = await this.getReservations();
    
    // Filtre les réservations non synchronisées
    const unsyncedReservations = reservations.filter(r => !r.googleEventId);
    
    let syncedCount = 0;
    
    // Synchronise chaque réservation
    for (const reservation of unsyncedReservations) {
      try {
        const { success, eventId } = await GoogleCalendarService.createEvent(reservation);
        
        if (success && eventId) {
          // Met à jour la réservation avec l'ID de l'événement Google Calendar
          reservation.googleEventId = eventId;
          syncedCount++;
        }
      } catch (error) {
        console.error(`Erreur lors de la synchronisation de la réservation ${reservation.id}:`, error);
      }
    }
    
    // Met à jour les réservations dans le stockage local
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    return { success: true, syncedCount };
  }
}
