
import { GoogleCalendarApiClient } from '../api-client';

export class EventFetchService {
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
}
