
// Ce service est une simulation qui sera remplacé par l'intégration réelle avec Google Calendar via Supabase
export class GoogleCalendarService {
  // Vérifie si l'utilisateur est connecté à Google Calendar
  static async isConnected(): Promise<boolean> {
    // Simuler un appel à Supabase pour vérifier si le token est présent
    return localStorage.getItem('googleRefreshToken') !== null;
  }

  // Connecte l'utilisateur à Google Calendar
  static async connect(): Promise<{ success: boolean; email?: string; token?: string }> {
    // Cette fonction serait remplacée par l'OAuth de Google via Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = "mock-refresh-token-" + Date.now();
        localStorage.setItem('googleRefreshToken', mockToken);
        localStorage.setItem('googleEmail', 'admin@restaurant.com');
        
        resolve({
          success: true,
          email: 'admin@restaurant.com',
          token: mockToken
        });
      }, 1000);
    });
  }

  // Déconnecte l'utilisateur de Google Calendar
  static async disconnect(): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('googleRefreshToken');
        localStorage.removeItem('googleEmail');
        
        resolve({ success: true });
      }, 500);
    });
  }

  // Crée un événement dans Google Calendar
  static async createEvent(reservation: any): Promise<{ success: boolean; eventId?: string }> {
    // Cette fonction serait remplacée par l'API Google Calendar via Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEventId = "google-event-" + Date.now();
        
        console.log('Créé événement Google Calendar:', {
          summary: `Réservation: ${reservation.name}`,
          description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || 'Aucune'}`,
          start: {
            dateTime: `${reservation.date.toISOString().split('T')[0]}T${reservation.time}:00`,
            timeZone: 'Europe/Paris',
          },
          end: {
            dateTime: `${reservation.date.toISOString().split('T')[0]}T${parseInt(reservation.time.split(':')[0]) + 2}:${reservation.time.split(':')[1]}:00`,
            timeZone: 'Europe/Paris',
          },
        });
        
        resolve({ 
          success: true,
          eventId: mockEventId
        });
      }, 800);
    });
  }

  // Récupère tous les événements du calendrier
  static async getEvents(): Promise<any[]> {
    // Cette fonction serait remplacée par l'API Google Calendar via Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEvents = [
          {
            id: 'event-1',
            summary: 'Réservation: Jean Dupont',
            start: {
              dateTime: '2023-10-15T19:30:00+02:00',
            },
            end: {
              dateTime: '2023-10-15T21:30:00+02:00',
            },
          },
          {
            id: 'event-2',
            summary: 'Réservation: Marie Martin',
            start: {
              dateTime: '2023-10-16T12:30:00+02:00',
            },
            end: {
              dateTime: '2023-10-16T14:30:00+02:00',
            },
          },
        ];
        
        resolve(mockEvents);
      }, 1000);
    });
  }
}
