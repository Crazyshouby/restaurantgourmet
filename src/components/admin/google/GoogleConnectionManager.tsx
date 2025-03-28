
import React from "react";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { AdminSettings } from "@/types";
import GoogleConnectionToggle from "./GoogleConnectionToggle";

interface GoogleConnectionManagerProps {
  isConnected: boolean;
  isLoading: boolean;
  onConnectionUpdated: (settings: Partial<AdminSettings>) => void;
  setIsLoading: (loading: boolean) => void;
}

const GoogleConnectionManager: React.FC<GoogleConnectionManagerProps> = ({
  isConnected,
  isLoading,
  onConnectionUpdated,
  setIsLoading
}) => {
  const handleGoogleConnect = async () => {
    try {
      console.log("Démarrage du processus de connexion Google...");
      toast.info("Redirection vers Google", {
        description: "Vous allez être redirigé pour vous connecter à votre compte Google."
      });
      
      // Augmentons le temps de chargement pour éviter les clics multiples pendant la redirection
      setIsLoading(true);
      
      const result = await GoogleCalendarService.connect();
      
      if (!result.success) {
        toast.error("Erreur de connexion", {
          description: "Une erreur est survenue lors de la connexion à Google."
        });
        setIsLoading(false);
      }
      
      // Note: Le loader reste actif jusqu'à la redirection
    } catch (error) {
      console.error("Erreur lors de la connexion à Google:", error);
      toast.error("Erreur de connexion", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
      setIsLoading(false);
    }
  };
  
  const handleGoogleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      console.log("Démarrage de la déconnexion Google...");
      const result = await GoogleCalendarService.disconnect();
      
      if (result.success) {
        onConnectionUpdated({
          googleConnected: false,
          googleEmail: undefined,
          googleRefreshToken: undefined,
          lastSyncTimestamp: undefined,
          lastSyncStatus: undefined,
          syncError: undefined
        });
        
        toast.info("Compte Google déconnecté", {
          description: "La synchronisation est désactivée."
        });
      } else {
        toast.error("Erreur de déconnexion", {
          description: "Impossible de déconnecter le compte Google."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion de Google:", error);
      toast.error("Erreur de déconnexion", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleConnectionToggle 
      isConnected={isConnected} 
      isLoading={isLoading} 
      onConnect={handleGoogleConnect} 
      onDisconnect={handleGoogleDisconnect} 
    />
  );
};

export default GoogleConnectionManager;
