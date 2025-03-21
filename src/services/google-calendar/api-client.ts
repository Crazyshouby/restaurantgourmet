
/**
 * Client API pour les appels directs à l'API Google Calendar
 */
import { GoogleCalendarAuthService } from './auth-service';

// Classe pour gérer les requêtes à l'API Google Calendar
export class GoogleCalendarApiClient {
  // Méthode pour envoyer une requête à l'API Google Calendar
  static async callApi<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET',
    body?: any
  ): Promise<T | null> {
    try {
      const isConnected = await GoogleCalendarAuthService.isConnected();
      
      if (!isConnected) {
        console.log('Google Calendar non connecté, impossible d\'appeler l\'API');
        return null;
      }
      
      // Obtenir le token d'accès actuel
      const accessToken = await GoogleCalendarAuthService.getAccessToken();
      
      if (!accessToken) {
        console.error('Token d\'accès non disponible');
        return null;
      }
      
      // Configuration de la requête
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Ajouter le corps de la requête si nécessaire
      if (body && method === 'POST') {
        requestOptions.body = JSON.stringify(body);
      }
      
      // Appel à l'API Google Calendar
      const response = await fetch(`https://www.googleapis.com/calendar/v3/${endpoint}`, requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Erreur API Google Calendar (${response.status}):`, errorData);
        return null;
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('Exception lors de l\'appel à l\'API Google Calendar:', error);
      return null;
    }
  }
}
