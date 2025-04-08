
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from '@/types';

/**
 * Service for fetching reservations
 */
export class ReservationFetchService {
  /**
   * Récupère toutes les réservations
   */
  static async getReservations(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw error;
    }

    // Convertit les dates en objets Date
    return data.map((reservation: any) => ({
      id: reservation.id,
      name: reservation.name,
      date: new Date(reservation.date),
      time: reservation.time,
      guests: reservation.guests,
      phone: reservation.phone,
      email: reservation.email,
      notes: reservation.notes || '',
      googleEventId: reservation.google_event_id,
      importedFromGoogle: reservation.imported_from_google || false
    }));
  }
}
