
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service pour la gestion de la synchronisation automatique
 */
export class ReservationAutoSyncService {
  /**
   * Déclenche une synchronisation manuelle
   */
  static async triggerSync(): Promise<{ success: boolean; message?: string; error?: string; reconnectionNeeded?: boolean }> {
    try {
      console.log("Déclenchement d'une synchronisation manuelle...");
      
      // Vérifier d'abord si la connexion Google est active
      const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('google_connected, google_refresh_token')
        .eq('id', 1)
        .single();
      
      if (!settingsData?.google_connected || !settingsData?.google_refresh_token) {
        console.log("Synchronisation impossible: Google non connecté ou token manquant");
        return { 
          success: false, 
          error: 'Connexion Google requise pour la synchronisation',
          reconnectionNeeded: true
        };
      }
      
      // Utiliser l'URL complète pour la fonction Edge
      const response = await fetch(`https://jmgzpeubdaemrxvsmwss.supabase.co/functions/v1/auto-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZ3pwZXViZGFlbXJ4dnNtd3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTczMjMsImV4cCI6MjA1ODA3MzMyM30.NJ9sJ6xhHZeUuAhioVWr0CqDYSH5LSy7aZyGk_HZ5Ng'}`
        }
      });
      
      const result = await response.json();
      console.log("Résultat de la synchronisation:", result);
      
      // Vérifier si l'erreur est liée à un refresh token invalide
      if (!result.success && result.error && (
          result.error.includes('invalid_grant') || 
          result.error.includes('refresh token') ||
          result.error.includes('Échec du rafraîchissement du token') ||
          result.error.includes('expiré') ||
          result.error.includes('Token Google expiré')
      )) {
        console.log("Token expiré détecté, marquage comme nécessitant reconnexion");
        
        // Indiquer que la connexion Google doit être renouvelée
        await supabase
          .from('admin_settings')
          .update({
            google_connected: false,
            last_sync_status: 'error',
            sync_error: 'Connexion Google expirée. Veuillez vous reconnecter.'
          })
          .eq('id', 1);
        
        return { 
          success: false, 
          error: 'La connexion à Google a expiré. Veuillez vous reconnecter à votre compte Google.',
          reconnectionNeeded: true
        };
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors du déclenchement de la synchronisation:', error);
      return { 
        success: false, 
        error: 'Impossible de déclencher la synchronisation'
      };
    }
  }

  /**
   * Obtient les logs de synchronisation récents
   */
  static async getSyncLogs(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select('*')
        .order('sync_timestamp', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Erreur lors de la récupération des logs de synchronisation:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Exception lors de la récupération des logs de synchronisation:', error);
      return [];
    }
  }

  static async updateAutoSyncSettings(enabled: boolean, interval: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          auto_sync_enabled: enabled,
          auto_sync_interval: interval
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Erreur lors de la mise à jour des paramètres de synchronisation:', error);
        toast.error('Erreur de mise à jour', {
          description: 'Impossible de mettre à jour les paramètres de synchronisation.'
        });
        return false;
      }
      
      toast.success('Paramètres mis à jour', {
        description: `Synchronisation automatique ${enabled ? 'activée' : 'désactivée'}.`
      });
      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour des paramètres de synchronisation:', error);
      toast.error('Erreur de mise à jour', {
        description: 'Une erreur est survenue. Veuillez réessayer.'
      });
      return false;
    }
  }

  /**
   * Vérifie le statut de la dernière synchronisation
   */
  static async checkSyncStatus(): Promise<{ 
    lastSync: string | null; 
    status: string | null; 
    error: string | null;
    autoSyncEnabled: boolean;
    autoSyncInterval: number;
    reconnectionNeeded: boolean;
  }> {
    try {
      console.log("Vérification du statut de synchronisation...");
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('last_sync_timestamp, last_sync_status, sync_error, auto_sync_enabled, auto_sync_interval, google_connected, google_refresh_token')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Erreur lors de la vérification du statut de synchronisation:', error);
        return { 
          lastSync: null, 
          status: null, 
          error: 'Impossible de vérifier le statut', 
          autoSyncEnabled: true,
          autoSyncInterval: 5,
          reconnectionNeeded: false
        };
      }
      
      // Détecter si une reconnexion est nécessaire
      const reconnectionNeeded = (
        !data.google_connected || 
        !data.google_refresh_token ||
        (data.sync_error !== null && (
          data.sync_error.includes('reconnect') || 
          data.sync_error.includes('expiré') ||
          data.sync_error.includes('invalid_grant') ||
          data.sync_error.includes('Token Google expiré')
        ))
      );
      
      console.log(`Statut de synchronisation: connecté=${data.google_connected}, reconnexion nécessaire=${reconnectionNeeded}`);
      
      return {
        lastSync: data.last_sync_timestamp,
        status: data.last_sync_status,
        error: data.sync_error,
        autoSyncEnabled: data.auto_sync_enabled,
        autoSyncInterval: data.auto_sync_interval,
        reconnectionNeeded
      };
    } catch (error) {
      console.error('Exception lors de la vérification du statut de synchronisation:', error);
      return { 
        lastSync: null, 
        status: null, 
        error: 'Une erreur est survenue lors de la vérification',
        autoSyncEnabled: true,
        autoSyncInterval: 5,
        reconnectionNeeded: false
      };
    }
  }

  /**
   * Réinitialise les paramètres de connexion Google
   */
  static async resetGoogleConnection(): Promise<boolean> {
    try {
      console.log("Réinitialisation de la connexion Google...");
      
      const { error } = await supabase
        .from('admin_settings')
        .update({
          google_connected: false,
          google_refresh_token: null,
          google_email: null,
          last_sync_status: null,
          sync_error: null
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Erreur lors de la réinitialisation de la connexion Google:', error);
        return false;
      }
      
      console.log("Connexion Google réinitialisée avec succès");
      return true;
    } catch (error) {
      console.error('Exception lors de la réinitialisation de la connexion Google:', error);
      return false;
    }
  }
}
