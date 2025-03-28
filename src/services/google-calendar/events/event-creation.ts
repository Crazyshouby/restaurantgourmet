
import { formatDateTimeForCalendar, calculateEndTime } from '../utils';
import { GoogleCalendarApiClient } from '../api-client';
import { GoogleCalendarAuthService } from '../auth-service';
import { GoogleCalendarEventResponse } from '../types';

export class EventCreationService {
  // Crée un événement dans Google Calendar
  static async createEvent(reservation: any): Promise<GoogleCalendarEventResponse> {
    try {
      if (!(await GoogleCalendarAuthService.isConnected())) {
        console.log('Google Calendar non connecté, impossible de créer un événement');
        return { success: false };
      }
      
      // Formatage de la date et de l'heure
      const startDateTime = formatDateTimeForCalendar(reservation.date, reservation.time);
      const endTime = calculateEndTime(reservation.time);
      const dateString = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0] 
        : reservation.date;
        
      console.log('Création d\'événement pour la date:', dateString, 'à', reservation.time);
      
      // Création de l'événement
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
      
      // Appel à l'API via le client
      const data = await GoogleCalendarApiClient.callApi<any>(
        'calendars/primary/events', 
        'POST', 
        eventData
      );
      
      if (!data || !data.id) {
        console.error('Erreur lors de la création de l\'événement:', data);
        return { success: false };
      }
      
      console.log('Événement créé avec succès, ID:', data.id);
      return {
        success: true,
        eventId: data.id
      };
    } catch (error) {
      console.error('Exception lors de la création de l\'événement Google Calendar:', error);
      return { success: false };
    }
  }
}
