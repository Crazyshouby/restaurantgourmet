
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from '@/types';
import { GoogleCalendarService } from '@/services/google-calendar';

/**
 * Service de base pour les opérations CRUD sur les réservations
 */
export class ReservationBaseService {
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

  /**
   * Met à jour une réservation existante
   */
  static async updateReservation(reservation: Reservation): Promise<boolean> {
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

    return true;
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
