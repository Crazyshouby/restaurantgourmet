
import { supabase } from '@/integrations/supabase/client';
import { getAdminSettings } from './utils';
import { GoogleCalendarAuthResponse } from './types';

export class GoogleCalendarAuthService {
  // Vérifie si l'utilisateur est connecté à Google Calendar
  static async isConnected(): Promise<boolean> {
    const settings = await getAdminSettings();
    return settings.googleConnected && !!settings.googleRefreshToken;
  }

  // Connecte l'utilisateur à Google Calendar via OAuth
  static async connect(): Promise<GoogleCalendarAuthResponse> {
    try {
      console.log('Démarrage du processus de connexion Google...');
      
      // Configuration simplifiée du flux OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
          },
          redirectTo: window.location.origin + '/admin?auth=success',
        },
      });
      
      if (error) {
        console.error('Erreur lors de la connexion à Google OAuth:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Redirection OAuth initiée avec succès');
      return { success: true };
    } catch (error) {
      console.error('Exception lors de la connexion à Google:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // Déconnecte l'utilisateur de Google Calendar
  static async disconnect(): Promise<{ success: boolean; error?: string }> {
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
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la déconnexion de Google:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // Obtient le token d'accès actuel
  static async getAccessToken(): Promise<string | null> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      return sessionData.session?.provider_token || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token d\'accès:', error);
      return null;
    }
  }
}
