
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from '@/types';
import { GoogleCalendarService } from '@/services/google-calendar';

/**
 * Service pour la mise à jour des réservations
 */
export class ReservationUpdateService {
  /**
   * Met à jour une réservation existante
   */
  static async updateReservation(reservation: Reservation): Promise<boolean> {
    try {
      // Convertir la date en format ISO pour Supabase (string)
      const formattedDate = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0] 
        : reservation.date;

      const { error } = await supabase
        .from('reservations')
        .update({
          name: reservation.name,
          date: formattedDate,
          time: reservation.time,
          guests: reservation.guests,
          phone: reservation.phone,
          email: reservation.email,
          notes: reservation.notes || ''
        })
        .eq('id', reservation.id);

      if (error) {
        console.error('Erreur lors de la mise à jour de la réservation:', error);
        throw error;
      }

      // Si la réservation a un ID d'événement Google, mettre à jour l'événement Google Calendar
      if (reservation.googleEventId) {
        console.log('Mise à jour de l\'événement Google Calendar:', reservation.googleEventId);
        try {
          const result = await GoogleCalendarService.updateEvent(reservation);
          if (!result.success) {
            console.warn('Échec de la mise à jour de l\'événement Google Calendar, mais la réservation a été mise à jour');
          }
        } catch (googleError) {
          console.error('Erreur lors de la mise à jour de l\'événement Google Calendar:', googleError);
          // Continuer même si la mise à jour Google échoue
        }
      }

      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour de la réservation:', error);
      throw error;
    }
  }

  /**
   * Met à jour l'ID de l'événement Google Calendar
   */
  static async updateGoogleEventId(reservationId: string, googleEventId: string): Promise<boolean> {
    const { error } = await supabase
      .from('reservations')
      .update({ google_event_id: googleEventId })
      .eq('id', reservationId);

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'ID d\'événement Google Calendar:', error);
      throw error;
    }

    return true;
  }
}
