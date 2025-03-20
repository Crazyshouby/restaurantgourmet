
import { GoogleCalendarService } from './GoogleCalendarService';
import { Reservation } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class ReservationService {
  // Récupère toutes les réservations
  static async getReservations(): Promise<Reservation[]> {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        return [];
      }
      
      return data.map((r: any) => ({
        ...r,
        date: new Date(r.date)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return [];
    }
  }

  // Crée une nouvelle réservation
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
      
      // Convert Date object to ISO string format (YYYY-MM-DD) for Supabase
      const dateString = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0] 
        : reservation.date;
      
      const newReservation = {
        ...reservation,
        date: dateString,
        google_event_id: googleEventId
      };
      
      // Enregistre dans Supabase
      const { data, error } = await supabase
        .from('reservations')
        .insert(newReservation)
        .select();
      
      if (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        throw error;
      }
      
      // Return the created reservation with proper date format
      return {
        ...data[0],
        date: new Date(data[0].date),
        googleEventId: data[0].google_event_id
      };
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  }

  // Synchronise les réservations existantes avec Google Calendar
  static async syncWithGoogleCalendar(): Promise<{ success: boolean; syncedCount: number }> {
    try {
      const isConnected = await GoogleCalendarService.isConnected();
      
      if (!isConnected) {
        return { success: false, syncedCount: 0 };
      }
      
      // Récupère toutes les réservations non synchronisées
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .is('google_event_id', null);
      
      if (error) {
        console.error('Erreur lors de la récupération des réservations non synchronisées:', error);
        return { success: false, syncedCount: 0 };
      }
      
      // Convertit les dates en objets Date
      const reservations = data.map((r: any) => ({
        ...r,
        date: new Date(r.date),
        googleEventId: r.google_event_id
      }));
      
      let syncedCount = 0;
      
      // Synchronise chaque réservation
      for (const reservation of reservations) {
        try {
          const { success, eventId } = await GoogleCalendarService.createEvent(reservation);
          
          if (success && eventId) {
            // Met à jour la réservation avec l'ID de l'événement Google Calendar
            const { error: updateError } = await supabase
              .from('reservations')
              .update({ google_event_id: eventId })
              .eq('id', reservation.id);
            
            if (!updateError) {
              syncedCount++;
            } else {
              console.error(`Erreur lors de la mise à jour de la réservation ${reservation.id}:`, updateError);
            }
          }
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de la réservation ${reservation.id}:`, error);
        }
      }
      
      return { success: true, syncedCount };
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Google Calendar:', error);
      return { success: false, syncedCount: 0 };
    }
  }
}
