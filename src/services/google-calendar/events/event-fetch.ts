
import { GoogleCalendarApiClient } from '../api-client';

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  description?: string;
  location?: string;
  [key: string]: any;
}

interface GoogleCalendarResponse {
  items?: GoogleCalendarEvent[];
  [key: string]: any;
}

export class EventFetchService {
  // Récupère tous les événements du calendrier
  static async getEvents(): Promise<GoogleCalendarEvent[]> {
    try {
      const events = await GoogleCalendarApiClient.callApi<GoogleCalendarResponse>('calendars/primary/events');
      
      if (!events) {
        return [];
      }
      
      return events.items || [];
    } catch (error) {
      console.error('Exception lors de la récupération des événements Google Calendar:', error);
      return [];
    }
  }
}
