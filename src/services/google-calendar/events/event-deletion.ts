
import { GoogleCalendarApiClient } from '../api-client';
import { GoogleCalendarAuthService } from '../auth-service';

export class EventDeletionService {
  // Service pour supprimer un événement de Google Calendar
  // Cette classe n'est pas utilisée dans le flux de suppression d'événements standard
  // mais est conservée pour référence future
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      if (!(await GoogleCalendarAuthService.isConnected())) {
        console.log('Google Calendar non connecté, impossible de supprimer l\'événement');
        return true; // Retourne vrai même si non connecté, car ce n'est pas une erreur critique
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
      // On retourne vrai malgré l'erreur pour ne pas bloquer la suppression dans Supabase
      return true;
    }
  }
}
