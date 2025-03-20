
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

  // Connecte l'utilisateur à Google Calendar via OAuth
  static async connect(): Promise<{ success: boolean; email?: string; token?: string }> {
    try {
      // Obtenir l'URL d'authentification Google
      const response = await fetch('/api/google-auth/init');
      const data = await response.json();
      
      if (data.url) {
        // Rediriger vers la page d'authentification Google
        window.location.href = data.url;
        return { success: true }; // Ce code ne sera pas exécuté en raison de la redirection
      }
      
      return { success: false };
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

  // Crée un événement dans Google Calendar
  static async createEvent(reservation: any): Promise<{ success: boolean; eventId?: string }> {
    try {
      const isConnected = await this.isConnected();
      
      if (!isConnected) {
        return { success: false };
      }
      
      // Appeler l'Edge Function pour créer l'événement
      const response = await fetch('/api/google-auth/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reservation })
      });
      
      const data = await response.json();
      
      if (data.success && data.eventId) {
        return {
          success: true,
          eventId: data.eventId
        };
      } else {
        console.error('Erreur lors de la création de l\'événement:', data.error);
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement Google Calendar:', error);
      return { success: false };
    }
  }

  // Récupère tous les événements du calendrier
  static async getEvents(): Promise<any[]> {
    try {
      const isConnected = await this.isConnected();
      
      if (!isConnected) {
        return [];
      }
      
      // Appeler l'Edge Function pour récupérer les événements
      const response = await fetch('/api/google-auth/events');
      const data = await response.json();
      
      if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else {
        console.error('Format de données incorrect pour les événements:', data);
        return [];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements Google Calendar:', error);
      return [];
    }
  }
}
