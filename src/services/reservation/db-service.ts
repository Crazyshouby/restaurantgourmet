
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from '@/types';

/**
 * Service pour les opérations de base de données sur les réservations
 */
export class ReservationDbService {
  /**
   * Crée une réservation dans la base de données
   * @param reservation Les données de la réservation
   * @param googleEventId L'ID de l'événement Google Calendar optionnel
   * @param importedFromGoogle Flag indiquant si la réservation a été importée de Google Calendar
   */
  static async createReservationInDatabase(
    reservation: Omit<Reservation, 'id' | 'googleEventId'> & { googleEventId?: string, importedFromGoogle?: boolean },
    googleEventId?: string,
    importedFromGoogle: boolean = false
  ): Promise<Reservation> {
    // Utiliser l'ID de l'événement Google fourni dans la réservation si disponible
    const finalGoogleEventId = reservation.googleEventId || googleEventId || null;
    const finalImportedFromGoogle = reservation.importedFromGoogle || importedFromGoogle || false;
    
    // Convertir la date en format ISO pour Supabase (string)
    const formattedDate = reservation.date instanceof Date 
      ? reservation.date.toISOString().split('T')[0] 
      : reservation.date;

    // Prépare les données pour insertion
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        name: reservation.name,
        date: formattedDate,
        time: reservation.time,
        guests: reservation.guests,
        phone: reservation.phone,
        email: reservation.email,
        notes: reservation.notes || '',
        google_event_id: finalGoogleEventId,
        imported_from_google: finalImportedFromGoogle
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }

    // Convertit et retourne la réservation créée
    return {
      id: data.id,
      name: data.name,
      date: new Date(data.date),
      time: data.time,
      guests: data.guests,
      phone: data.phone,
      email: data.email,
      notes: data.notes,
      googleEventId: data.google_event_id,
      importedFromGoogle: data.imported_from_google
    };
  }
}
