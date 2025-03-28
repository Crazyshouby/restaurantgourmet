
import React from "react";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { ReservationService } from "@/services/ReservationService";
import GoogleConnectedAccount from "./GoogleConnectedAccount";
import GoogleAutoSyncStatus from "./GoogleAutoSyncStatus";

interface GoogleSyncControlsProps {
  email?: string;
  isLoading: boolean;
  lastSyncTimestamp?: string;
  lastSyncStatus?: string;
  syncError?: string;
  onRefreshReservations: () => void;
  onSettingsUpdated: () => Promise<void>;
}

const GoogleSyncControls: React.FC<GoogleSyncControlsProps> = ({
  email,
  isLoading,
  lastSyncTimestamp,
  lastSyncStatus,
  syncError,
  onRefreshReservations,
  onSettingsUpdated
}) => {
  const syncNow = async () => {
    toast.loading("Synchronisation en cours...");
    
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
    }
  };

  const importFromGoogle = async () => {
    toast.loading("Importation en cours...");
    
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
    }
  };

  return (
    <div className="space-y-3">
      <GoogleConnectedAccount
        email={email}
        onSyncToGoogle={syncNow}
        onImportFromGoogle={importFromGoogle}
        isLoading={isLoading}
      />
      
      <GoogleAutoSyncStatus
        lastSyncTimestamp={lastSyncTimestamp}
        lastSyncStatus={lastSyncStatus}
        syncError={syncError}
        onSync={syncNow}
      />
    </div>
  );
};

export default GoogleSyncControls;
