
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/google-calendar";
import { ReservationService } from "@/services/reservation";
import { AdminSettings } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// Import our component files
import GoogleIcon from "./google/GoogleIcon";
import GoogleConnectionToggle from "./google/GoogleConnectionToggle";
import GoogleConnectedAccount from "./google/GoogleConnectedAccount";
import GoogleConnectionStatus from "./google/GoogleConnectionStatus";
import CapacitySettings from "./CapacitySettings";
import { useLoadingState } from "@/hooks/useLoadingState";

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
  const { 
    isLoading: isSyncLoading, 
    startLoading, 
    stopLoading,
    withLoading
  } = useLoadingState();
  
  const handleGoogleConnect = async () => {
    if (isLoading || isSyncLoading) return;
    
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
          description: result.error || "Une erreur est survenue lors de la connexion à Google."
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
    if (isLoading || isSyncLoading) return;
    
    await withLoading(async () => {
      try {
        console.log("Démarrage de la déconnexion Google...");
        setIsLoading(true);
        
        const result = await GoogleCalendarService.disconnect();
        
        if (result.success) {
          setAdminSettings({
            ...adminSettings,
            googleConnected: false,
            googleEmail: undefined,
            googleRefreshToken: undefined
          });
          
          toast.success("Compte Google déconnecté", {
            description: "La synchronisation est désactivée."
          });
        } else {
          toast.error("Erreur de déconnexion", {
            description: result.error || "Impossible de déconnecter le compte Google."
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
    }, "Déconnexion en cours...");
  };
  
  const syncNow = async () => {
    if (isLoading || isSyncLoading) return;
    
    await withLoading(async () => {
      try {
        console.log("Démarrage de la synchronisation...");
        setIsLoading(true);
        
        const result = await ReservationService.syncWithGoogleCalendar();
        
        if (result.success) {
          toast.success("Synchronisation terminée", {
            description: `${result.syncedCount} réservation(s) synchronisée(s) avec Google Calendar.`
          });
          
          onRefreshReservations();
        } else {
          toast.error("Erreur de synchronisation", {
            description: result.error || "Impossible de synchroniser avec Google Calendar."
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
    }, "Synchronisation en cours...");
  };

  const importFromGoogle = async () => {
    if (isLoading || isSyncLoading) return;
    
    await withLoading(async () => {
      try {
        console.log("Démarrage de l'importation depuis Google Calendar...");
        setIsLoading(true);
        
        const result = await ReservationService.importFromGoogleCalendar();
        
        if (result.success) {
          toast.success("Importation terminée", {
            description: `${result.importedCount} réservation(s) importée(s) depuis Google Calendar.`
          });
          
          onRefreshReservations();
        } else {
          toast.error("Erreur d'importation", {
            description: result.error || "Impossible d'importer depuis Google Calendar."
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
    }, "Importation en cours...");
  };

  return (
    <Card className="shadow-card h-full relative">
      {(isLoading || isSyncLoading) && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner size="lg" message={isSyncLoading ? "Opération en cours..." : "Chargement..."} />
        </div>
      )}
      
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
          isLoading={isLoading || isSyncLoading}
          onConnect={handleGoogleConnect}
          onDisconnect={handleGoogleDisconnect}
        />
        
        {adminSettings.googleConnected && (
          <GoogleConnectedAccount
            email={adminSettings.googleEmail}
            onSyncToGoogle={syncNow}
            onImportFromGoogle={importFromGoogle}
            isLoading={isLoading || isSyncLoading}
          />
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
