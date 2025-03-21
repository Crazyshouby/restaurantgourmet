
import { Reservation } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service de base pour les opérations CRUD sur les réservations
 */
export class ReservationBaseService {
  /**
   * Récupère toutes les réservations
   */
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

  /**
   * Crée une nouvelle réservation dans Supabase
   */
  static async createReservationInDatabase(
    reservation: Omit<Reservation, 'id'>,
    googleEventId?: string
  ): Promise<Reservation> {
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
  }

  /**
   * Supprime une réservation
   */
  static async deleteReservation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      return false;
    }
  }

  /**
   * Met à jour l'ID de l'événement Google Calendar pour une réservation
   */
  static async updateGoogleEventId(reservationId: string, googleEventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ google_event_id: googleEventId })
        .eq('id', reservationId);
      
      if (error) {
        console.error(`Erreur lors de la mise à jour de l'ID d'événement Google pour la réservation ${reservationId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'ID d'événement Google pour la réservation ${reservationId}:`, error);
      return false;
    }
  }
}
