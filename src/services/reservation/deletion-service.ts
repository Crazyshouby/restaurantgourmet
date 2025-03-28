
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarService } from '@/services/google-calendar';

/**
 * Service pour la suppression des réservations
 */
export class ReservationDeletionService {
  /**
   * Récupère les détails d'une réservation par son ID
   */
  private static async getReservationDetails(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('google_event_id, imported_from_google')
      .eq('id', id)
      .single();
        
    if (error) {
      console.error('Erreur lors de la récupération de la réservation:', error);
      throw error;
    }
    
    return data;
  }
  
  /**
   * Supprime l'événement Google Calendar associé si disponible
   */
  private static async deleteGoogleEvent(googleEventId: string) {
    if (!googleEventId) return true;
    
    try {
      console.log('Suppression de l\'événement Google Calendar:', googleEventId);
      const deleted = await GoogleCalendarService.deleteEvent(googleEventId);
      console.log('Événement Google Calendar supprimé avec succès:', deleted);
      return deleted;
    } catch (error) {
      // On continue même si la suppression Google échoue
      console.error('Erreur lors de la suppression de l\'événement Google Calendar:', error);
      return false;
    }
  }
  
  /**
   * Supprime la réservation de la base de données
   */
  private static async deleteReservationFromDatabase(id: string) {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
    
    return true;
  }

  /**
   * Supprime une réservation et son événement Google Calendar associé si disponible
   */
  static async deleteReservation(id: string): Promise<boolean> {
    try {
      // 1. Récupérer les détails de la réservation
      const reservation = await ReservationDeletionService.getReservationDetails(id);
      
      // 2. Supprimer l'événement Google Calendar si disponible
      if (reservation && reservation.google_event_id) {
        await ReservationDeletionService.deleteGoogleEvent(reservation.google_event_id);
      }
      
      // 3. Supprimer la réservation de la base de données
      return await ReservationDeletionService.deleteReservationFromDatabase(id);
    } catch (error) {
      console.error('Exception lors de la suppression de la réservation:', error);
      throw error;
    }
  }
}
