
import { supabase } from '@/integrations/supabase/client';
import { GoogleCalendarService } from '@/services/google-calendar';

/**
 * Service pour la suppression des réservations
 */
export class ReservationDeletionService {
  /**
   * Supprime une réservation
   */
  static async deleteReservation(id: string): Promise<boolean> {
    try {
      // D'abord, récupérer les détails de la réservation pour obtenir l'ID de l'événement Google
      const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select('google_event_id, imported_from_google')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error('Erreur lors de la récupération de la réservation:', fetchError);
        throw fetchError;
      }
      
      // Si la réservation a un événement Google associé, le supprimer
      // que la réservation ait été importée de Google ou créée dans l'application
      if (reservation && reservation.google_event_id) {
        try {
          // Tenter de supprimer l'événement de Google Calendar
          console.log('Suppression de l\'événement Google Calendar:', reservation.google_event_id);
          const deleted = await GoogleCalendarService.deleteEvent(reservation.google_event_id);
          console.log('Événement Google Calendar supprimé avec succès:', deleted);
        } catch (googleError) {
          // Si la suppression de l'événement Google échoue, on continue quand même
          // avec la suppression de la réservation dans notre système
          console.error('Erreur lors de la suppression de l\'événement Google Calendar:', googleError);
        }
      }
      
      // Supprimer la réservation de la base de données
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Exception lors de la suppression de la réservation:', error);
      throw error;
    }
  }
}
