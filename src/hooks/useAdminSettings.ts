import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSettings } from "@/types";
import { toast } from "sonner";

export function useAdminSettings() {
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    googleConnected: false,
    googleEmail: undefined,
    timeSlots: [],
    maxGuestsPerDay: 20
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const loadAdminSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        console.log('Paramètres admin chargés:', data);
        setAdminSettings({
          googleConnected: data.google_connected,
          googleEmail: data.google_email,
          googleRefreshToken: data.google_refresh_token,
          timeSlots: data.time_slots || [],
          maxGuestsPerDay: data.max_guests_per_day || 20,
          lastSyncTimestamp: data.last_sync_timestamp,
          lastSyncStatus: data.last_sync_status,
          syncError: data.sync_error
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres admin:", error);
    }
  };

  const updateGoogleSettings = async (session: any) => {
    try {
      setIsLoading(true);
      
      if (session?.provider_token && session?.user?.email) {
        console.log('Mise à jour des paramètres avec email:', session.user.email);
        
        const { error } = await supabase
          .from('admin_settings')
          .update({
            google_connected: true,
            google_refresh_token: session.refresh_token,
            google_email: session.user.email,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1);
        
        if (!error) {
          setAdminSettings(prevSettings => ({
            ...prevSettings,
            googleConnected: true,
            googleEmail: session.user.email,
            googleRefreshToken: session.refresh_token
          }));
          
          toast.success("Connexion Google réussie", {
            description: "Votre compte Google a été connecté avec succès."
          });
          
          console.log('Paramètres mis à jour avec succès');
          return true;
        } else {
          console.error('Erreur lors de la mise à jour dans Supabase:', error);
          toast.error("Erreur de connexion", {
            description: "Impossible de mettre à jour les paramètres."
          });
        }
      } else {
        console.warn('Session valide mais provider_token ou email manquant');
        toast.error("Erreur de connexion", {
          description: "Informations de session incomplètes."
        });
      }
      
      return false;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      toast.error("Erreur de connexion", {
        description: "Une erreur est survenue lors de la mise à jour des paramètres."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adminSettings,
    setAdminSettings,
    isLoading,
    setIsLoading,
    loadAdminSettings,
    updateGoogleSettings
  };
}
