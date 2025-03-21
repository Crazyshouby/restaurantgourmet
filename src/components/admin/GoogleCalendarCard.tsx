
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Download, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import { AdminSettings } from "@/types";

const GoogleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    <path d="M17.8 12.2H12v3.186h3.357c-.31 1.636-1.747 2.814-3.357 2.814-1.933 0-3.5-1.568-3.5-3.5s1.567-3.5 3.5-3.5c.884 0 1.69.334 2.304.876l2.234-2.234C15.137 8.557 13.646 8 12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c3.052 0 5.686-2.184 6.255-5.218.17-.916.1-2.046-.455-2.582z" />
  </svg>
);

interface GoogleCalendarCardProps {
  adminSettings: AdminSettings;
  isLoading: boolean;
  onRefreshReservations: () => void;
  setIsLoading: (loading: boolean) => void;
  setAdminSettings: (settings: AdminSettings) => void;
}

const GoogleCalendarCard: React.FC<GoogleCalendarCardProps> = ({
  adminSettings,
  isLoading,
  onRefreshReservations,
  setIsLoading,
  setAdminSettings
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
          googleConnected: false,
          googleEmail: undefined,
          googleRefreshToken: undefined
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GoogleIcon />
          Google Calendar
        </CardTitle>
        <CardDescription>
          Synchronisez vos réservations avec Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="google-sync">Synchronisation</Label>
          <Switch 
            id="google-sync" 
            checked={adminSettings.googleConnected}
            disabled={isLoading}
            onCheckedChange={(checked) => {
              if (checked) {
                handleGoogleConnect();
              } else {
                handleGoogleDisconnect();
              }
            }}
          />
        </div>
        
        {adminSettings.googleConnected && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="font-medium mb-1">Compte connecté :</div>
            <div className="text-muted-foreground mb-2">{adminSettings.googleEmail}</div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={syncNow}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchroniser vers Google
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={importFromGoogle}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Importer depuis Google
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {adminSettings.googleConnected ? (
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            Les réservations sont automatiquement synchronisées
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-red-600" />
            Synchronisation Google Calendar désactivée
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarCard;
