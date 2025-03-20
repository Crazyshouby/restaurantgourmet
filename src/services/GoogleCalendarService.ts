
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
      // Utilisation de la bonne URI de redirection pour Supabase
      const redirectUri = 'https://jmgzepudbaemnxrswmss.supabase.co/auth/v1/callback';
      
      console.log('Démarrage de la connexion Google avec redirectUri:', redirectUri);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          },
          redirectTo: `${window.location.origin}/admin?auth=success`,
        },
      });
      
      if (error) {
        console.error('Erreur lors de la connexion à Google:', error);
        return { success: false };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la connexion à Google:', error);
      return { success: false };
    }
  }

  // Déconnecte l'utilisateur de Google Calendar
  static async disconnect(): Promise<{ success: boolean }> {
    try {
      // D'abord, signOut uniquement pour les sessions Google
      await supabase.auth.signOut();
      
      // Puis mise à jour des paramètres admin
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
      
      // Obtenir le token d'accès actuel
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.provider_token;
      
      if (!accessToken) {
        console.error('Token d\'accès non disponible');
        return { success: false };
      }
      
      // Formatage de la date et de l'heure
      const dateString = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0] 
        : reservation.date;
      
      // Création de l'événement
      const eventData = {
        summary: `Réservation: ${reservation.name}`,
        description: `Réservation pour ${reservation.guests} personne(s)\nTél: ${reservation.phone}\nEmail: ${reservation.email}\nNotes: ${reservation.notes || "Aucune"}`,
        start: {
          dateTime: `${dateString}T${reservation.time}:00`,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: `${dateString}T${parseInt(reservation.time.split(':')[0]) + 2}:${reservation.time.split(':')[1]}:00`,
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
        console.error('Erreur lors de la création de l\'événement:', data);
        return { success: false };
      }
      
      return {
        success: true,
        eventId: data.id
      };
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
      
      // Obtenir le token d'accès actuel
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.provider_token;
      
      if (!accessToken) {
        console.error('Token d\'accès non disponible');
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
        console.error('Erreur lors de la récupération des événements:', data);
        return [];
      }
      
      return data.items || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des événements Google Calendar:', error);
      return [];
    }
  }
}
