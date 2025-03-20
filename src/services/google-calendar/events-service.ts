
import { formatDateTimeForCalendar, calculateEndTime } from './utils';
import { GoogleCalendarAuthService } from './auth-service';
import { GoogleCalendarEventResponse, GoogleCalendarEvent } from './types';
import { Reservation } from '@/types';

export class GoogleCalendarEventsService {
  // Crée un événement dans Google Calendar
  static async createEvent(reservation: any): Promise<GoogleCalendarEventResponse> {
    try {
      const isConnected = await GoogleCalendarAuthService.isConnected();
      
      if (!isConnected) {
        console.log('Google Calendar non connecté, impossible de créer un événement');
        return { success: false };
      }
      
      // Obtenir le token d'accès actuel
      const accessToken = await GoogleCalendarAuthService.getAccessToken();
      
      if (!accessToken) {
        console.error('Token d\'accès non disponible');
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
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: `${dateString}T${endTime}`,
          timeZone: 'Europe/Paris',
        },
      };
      
      // Appel direct à l'API Google Calendar
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erreur API lors de la création de l\'événement:', data);
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

  // Récupère tous les événements du calendrier
  static async getEvents(): Promise<any[]> {
    try {
      const isConnected = await GoogleCalendarAuthService.isConnected();
      
      if (!isConnected) {
        console.log('Google Calendar non connecté, impossible de récupérer les événements');
        return [];
      }
      
      // Obtenir le token d'accès actuel
      const accessToken = await GoogleCalendarAuthService.getAccessToken();
      
      if (!accessToken) {
        console.error('Token d\'accès non disponible pour récupérer les événements');
        return [];
      }
      
      // Appel direct à l'API Google Calendar
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erreur API lors de la récupération des événements:', data);
        return [];
      }
      
      return data.items || [];
    } catch (error) {
      console.error('Exception lors de la récupération des événements Google Calendar:', error);
      return [];
    }
  }
}
