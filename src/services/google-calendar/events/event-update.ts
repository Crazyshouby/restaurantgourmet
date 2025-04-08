
import { formatDateTimeForCalendar, calculateEndTime } from '../utils';
import { GoogleCalendarApiClient } from '../api-client';
import { GoogleCalendarAuthService } from '../auth-service';
import { GoogleCalendarEventResponse } from '../types';
import { Reservation } from '@/types';

export class EventUpdateService {
  // Méthode pour mettre à jour un événement Google Calendar
  static async updateEvent(reservation: Reservation): Promise<GoogleCalendarEventResponse> {
    try {
      if (!reservation.googleEventId) {
        console.log('Pas d\'ID d\'événement Google Calendar, impossible de mettre à jour');
        return { success: false };
      }
      
      if (!(await GoogleCalendarAuthService.isConnected())) {
        console.log('Google Calendar non connecté, impossible de mettre à jour l\'événement');
        return { success: false };
      }
      
      // Formatage de la date et de l'heure
      const startDateTime = formatDateTimeForCalendar(reservation.date, reservation.time);
      const endTime = calculateEndTime(reservation.time);
      const dateString = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0] 
        : reservation.date;
        
      console.log('Mise à jour d\'événement pour la date:', dateString, 'à', reservation.time);
      
      // Données de l'événement
      const eventData = {
        summary: `Réservation: ${reservation.name}`,
        description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || "Aucune"}`,
        start: {
          dateTime: startDateTime,
          timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
        },
        end: {
          dateTime: `${dateString}T${endTime}`,
          timeZone: 'America/New_York', // GMT-4 (fuseau horaire de l'Est canadien)
        },
      };
      
      // Utiliser PATCH au lieu de POST pour la mise à jour
      const data = await GoogleCalendarApiClient.callApi<any>(
        `calendars/primary/events/${reservation.googleEventId}`, 
        'PATCH', 
        eventData
      );
      
      if (!data || !data.id) {
        console.error('Erreur lors de la mise à jour de l\'événement:', data);
        return { success: false };
      }
      
      console.log('Événement mis à jour avec succès, ID:', data.id);
      return {
        success: true,
        eventId: data.id
      };
    } catch (error) {
      console.error('Exception lors de la mise à jour de l\'événement Google Calendar:', error);
      return { success: false };
    }
  }
}
