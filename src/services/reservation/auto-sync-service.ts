
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service pour la gestion de la synchronisation automatique
 */
export class ReservationAutoSyncService {
  /**
   * Déclenche une synchronisation manuelle
   */
  static async triggerSync(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Utiliser l'URL complète pour la fonction Edge
      const response = await fetch(`https://jmgzpeubdaemrxvsmwss.supabase.co/functions/v1/auto-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZ3pwZXViZGFlbXJ4dnNtd3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTczMjMsImV4cCI6MjA1ODA3MzMyM30.NJ9sJ6xhHZeUuAhioVWr0CqDYSH5LSy7aZyGk_HZ5Ng'}`
        }
      });
      
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Erreur lors du déclenchement de la synchronisation:', error);
      return { success: false, error: 'Impossible de déclencher la synchronisation' };
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

  /**
   * Met à jour les paramètres de synchronisation automatique
   */
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
  }> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('last_sync_timestamp, last_sync_status, sync_error, auto_sync_enabled, auto_sync_interval')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Erreur lors de la vérification du statut de synchronisation:', error);
        return { 
          lastSync: null, 
          status: null, 
          error: 'Impossible de vérifier le statut', 
          autoSyncEnabled: true,
          autoSyncInterval: 5
        };
      }
      
      return {
        lastSync: data.last_sync_timestamp,
        status: data.last_sync_status,
        error: data.sync_error,
        autoSyncEnabled: data.auto_sync_enabled,
        autoSyncInterval: data.auto_sync_interval
      };
    } catch (error) {
      console.error('Exception lors de la vérification du statut de synchronisation:', error);
      return { 
        lastSync: null, 
        status: null, 
        error: 'Une erreur est survenue lors de la vérification',
        autoSyncEnabled: true,
        autoSyncInterval: 5
      };
    }
  }
}
