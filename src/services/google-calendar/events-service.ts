import { formatDateTimeForCalendar, calculateEndTime } from './utils';
import { GoogleCalendarApiClient } from './api-client';
import { GoogleCalendarAuthService } from './auth-service';
import { GoogleCalendarEventResponse, GoogleCalendarEvent } from './types';
import { Reservation } from '@/types';

export class GoogleCalendarEventsService {
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

  // Récupère tous les événements du calendrier
  static async getEvents(): Promise<any[]> {
    try {
      const events = await GoogleCalendarApiClient.callApi<{items?: any[]}>('calendars/primary/events');
      
      if (!events) {
        return [];
      }
      
      return events.items || [];
    } catch (error) {
      console.error('Exception lors de la récupération des événements Google Calendar:', error);
      return [];
    }
  }

  // Supprime un événement de Google Calendar
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      if (!(await GoogleCalendarAuthService.isConnected())) {
        console.log('Google Calendar non connecté, impossible de supprimer l\'événement');
        return false;
      }
      
      console.log(`Suppression de l'événement Google Calendar avec l'ID: ${eventId}`);
      
      // Appel à l'API via le client pour supprimer l'événement
      await GoogleCalendarApiClient.callApi(
        `calendars/primary/events/${eventId}`, 
        'DELETE'
      );
      
      console.log('Événement supprimé avec succès de Google Calendar');
      return true;
    } catch (error) {
      console.error('Exception lors de la suppression de l\'événement Google Calendar:', error);
      return false;
    }
  }

  // Convertit les événements Google Calendar en réservations
  static async convertEventsToReservations(events: any[]): Promise<Omit<Reservation, 'id' | 'googleEventId'>[]> {
    try {
      const reservations: Omit<Reservation, 'id' | 'googleEventId'>[] = [];
      
      for (const event of events) {
        // On ne traite que les événements qui commencent par "Réservation:"
        if (!event.summary || !event.summary.startsWith('Réservation:')) {
          continue;
        }
        
        // Extraction des informations de l'événement
        const name = event.summary.replace('Réservation:', '').trim();
        let guests = 1;
        let phone = '';
        let email = '';
        let notes = '';
        
        // Analyse de la description pour extraire les détails
        if (event.description) {
          const descLines = event.description.split('\n');
          
          for (const line of descLines) {
            if (line.startsWith('Réservation pour')) {
              const guestsMatch = line.match(/Réservation pour (\d+) personne/);
              if (guestsMatch && guestsMatch[1]) {
                guests = parseInt(guestsMatch[1], 10);
              }
            } else if (line.startsWith('Tél:')) {
              phone = line.replace('Tél:', '').trim();
            } else if (line.startsWith('Email:')) {
              email = line.replace('Email:', '').trim();
            } else if (line.startsWith('Notes:')) {
              notes = line.replace('Notes:', '').trim();
            }
          }
        }
        
        // S'assurer que nous avons les informations minimales requises
        if (!name || !event.start || !event.start.dateTime) {
          continue;
        }
        
        // Formatage de la date et de l'heure
        const startDateTime = new Date(event.start.dateTime);
        const date = startDateTime.toISOString().split('T')[0];
        const time = startDateTime.toTimeString().substring(0, 5);
        
        // Création de la réservation
        reservations.push({
          name,
          date: new Date(date),
          time,
          guests,
          phone: phone || '0000000000', // Valeur par défaut si manquante
          email: email || 'noemail@example.com', // Valeur par défaut si manquante
          notes: notes
        });
      }
      
      return reservations;
    } catch (error) {
      console.error('Exception lors de la conversion des événements en réservations:', error);
      return [];
    }
  }
}
