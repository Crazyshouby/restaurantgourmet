
import { supabase } from '@/integrations/supabase/client';
import { Reservation, AdminSettings } from '@/types';

export class GoogleCalendarService {
  // Récupère les paramètres d'administration
  private static async getAdminSettings(): Promise<AdminSettings> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Erreur lors de la récupération des paramètres admin:', error);
        return { googleConnected: false };
      }
      
      return {
        googleConnected: data.google_connected,
        googleRefreshToken: data.google_refresh_token,
        googleEmail: data.google_email
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres admin:', error);
      return { googleConnected: false };
    }
  }

  // Vérifie si l'utilisateur est connecté à Google Calendar
  static async isConnected(): Promise<boolean> {
    const settings = await this.getAdminSettings();
    return settings.googleConnected && !!settings.googleRefreshToken;
  }

  // Connecte l'utilisateur à Google Calendar (simulation)
  static async connect(): Promise<{ success: boolean; email?: string; token?: string }> {
    try {
      const mockToken = "mock-refresh-token-" + Date.now();
      const mockEmail = 'admin@restaurant.com';
      
      // Met à jour les paramètres dans Supabase
      const { error } = await supabase
        .from('admin_settings')
        .update({
          google_connected: true,
          google_refresh_token: mockToken,
          google_email: mockEmail
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Erreur lors de la connexion à Google:', error);
        return { success: false };
      }
      
      return {
        success: true,
        email: mockEmail,
        token: mockToken
      };
    } catch (error) {
      console.error('Erreur lors de la connexion à Google:', error);
      return { success: false };
    }
  }

  // Déconnecte l'utilisateur de Google Calendar
  static async disconnect(): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          google_connected: false,
          google_refresh_token: null,
          google_email: null
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Erreur lors de la déconnexion de Google:', error);
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la déconnexion de Google:', error);
      return { success: false };
    }
  }

  // Crée un événement dans Google Calendar (simulation)
  static async createEvent(reservation: any): Promise<{ success: boolean; eventId?: string }> {
    // Simule l'appel à l'API Google (serait remplacé par une véritable intégration)
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

  // Récupère tous les événements du calendrier (simulation)
  static async getEvents(): Promise<any[]> {
    // Simule une requête à l'API Google
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
