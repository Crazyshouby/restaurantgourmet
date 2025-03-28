
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { AdminSettings } from "@/types";

// Import our new component files
import GoogleIcon from "./google/GoogleIcon";
import GoogleConnectionToggle from "./google/GoogleConnectionToggle";
import GoogleConnectedAccount from "./google/GoogleConnectedAccount";
import GoogleConnectionStatus from "./google/GoogleConnectionStatus";
import GoogleAutoSyncStatus from "./google/GoogleAutoSyncStatus";
import CapacitySettings from "./CapacitySettings";

interface GoogleCalendarCardProps {
  adminSettings: AdminSettings;
  isLoading: boolean;
  onRefreshReservations: () => void;
  setIsLoading: (loading: boolean) => void;
  setAdminSettings: (settings: AdminSettings) => void;
  onSettingsUpdated: () => Promise<void>;
}

const GoogleCalendarCard: React.FC<GoogleCalendarCardProps> = ({
  adminSettings,
  isLoading,
  onRefreshReservations,
  setIsLoading,
  setAdminSettings,
  onSettingsUpdated
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
        setAdminSettings({
          ...adminSettings,
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
  
  const syncNow = async () => {
    setIsLoading(true);
    
    try {
      console.log("Démarrage de la synchronisation...");
      const result = await ReservationService.syncWithGoogleCalendar();
      
      if (result.success) {
        toast.success("Synchronisation terminée", {
          description: `${result.syncedCount} réservation(s) synchronisée(s) avec Google Calendar.`
        });
        
        onRefreshReservations();
        // Rafraîchir également les paramètres admin pour mettre à jour le statut de synchronisation
        await onSettingsUpdated();
      } else {
        toast.error("Erreur de synchronisation", {
          description: "Impossible de synchroniser avec Google Calendar."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      toast.error("Erreur de synchronisation", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importFromGoogle = async () => {
    setIsLoading(true);
    
    try {
      console.log("Démarrage de l'importation depuis Google Calendar...");
      const result = await ReservationService.importFromGoogleCalendar();
      
      if (result.success) {
        toast.success("Importation terminée", {
          description: `${result.importedCount} réservation(s) importée(s) depuis Google Calendar.`
        });
        
        onRefreshReservations();
      } else {
        toast.error("Erreur d'importation", {
          description: "Impossible d'importer depuis Google Calendar."
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast.error("Erreur d'importation", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-card h-full">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <GoogleIcon />
          Google Calendar
        </CardTitle>
        <CardDescription className="text-xs">
          Synchronisez vos réservations avec Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-2">
        <GoogleConnectionToggle 
          isConnected={adminSettings.googleConnected}
          isLoading={isLoading}
          onConnect={handleGoogleConnect}
          onDisconnect={handleGoogleDisconnect}
        />
        
        {adminSettings.googleConnected && (
          <>
            <GoogleConnectedAccount
              email={adminSettings.googleEmail}
              onSyncToGoogle={syncNow}
              onImportFromGoogle={importFromGoogle}
              isLoading={isLoading}
            />
            
            <GoogleAutoSyncStatus
              lastSyncTimestamp={adminSettings.lastSyncTimestamp}
              lastSyncStatus={adminSettings.lastSyncStatus}
              syncError={adminSettings.syncError}
              onSync={syncNow}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4 py-3 px-4">
        <GoogleConnectionStatus isConnected={adminSettings.googleConnected} />
        
        {/* Paramètres de capacité intégrés dans la même carte */}
        <div className="w-full pt-3 border-t">
          <CapacitySettings 
            adminSettings={adminSettings}
            onSettingsUpdated={onSettingsUpdated}
            isLoading={isLoading}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarCard;
