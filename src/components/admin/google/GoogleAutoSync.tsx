
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ReservationService } from "@/services/ReservationService";
import { toast } from "sonner";

interface GoogleAutoSyncProps {
  isConnected: boolean;
  isLoading: boolean;
  onStatusChanged?: () => Promise<void>;
}

const GoogleAutoSync: React.FC<GoogleAutoSyncProps> = ({
  isConnected,
  isLoading,
  onStatusChanged
}) => {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Charger les paramètres initiaux
  useEffect(() => {
    loadSyncStatus();
  }, [isConnected]);

  const loadSyncStatus = async () => {
    if (!isConnected) return;
    
    setIsCheckingStatus(true);
    try {
      const status = await ReservationService.checkSyncStatus();
      setLastSync(status.lastSync);
      setSyncStatus(status.status);
      setSyncError(status.error);
      setAutoSyncEnabled(status.autoSyncEnabled);
      setSyncInterval(status.autoSyncInterval);
    } catch (error) {
      console.error("Erreur lors du chargement du statut:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const success = await ReservationService.updateAutoSyncSettings(
        autoSyncEnabled,
        syncInterval
      );
      
      if (success && onStatusChanged) {
        await onStatusChanged();
        loadSyncStatus();
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerSync = async () => {
    if (isLoading) return;
    
    toast.info("Synchronisation en cours", {
      description: "Veuillez patienter pendant la synchronisation..."
    });
    
    try {
      const result = await ReservationService.triggerSync();
      
      if (result.success) {
        toast.success("Synchronisation terminée", {
          description: result.message || `Synchronisation réussie.`
        });
        
        // Recharger le statut
        if (onStatusChanged) await onStatusChanged();
        loadSyncStatus();
      } else {
        toast.error("Erreur de synchronisation", {
          description: result.error || "Une erreur est survenue lors de la synchronisation."
        });
      }
    } catch (error) {
      console.error("Erreur lors du déclenchement de la synchronisation:", error);
      toast.error("Erreur de synchronisation", {
        description: "Impossible de déclencher la synchronisation."
      });
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4 border-t pt-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-sync" className="text-sm font-medium">
          Synchronisation automatique
        </Label>
        <Switch
          id="auto-sync"
          checked={autoSyncEnabled}
          disabled={isLoading || isSaving}
          className={autoSyncEnabled ? "data-[state=checked]:bg-green-500" : ""}
          onCheckedChange={setAutoSyncEnabled}
        />
      </div>
      
      {autoSyncEnabled && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sync-interval" className="text-sm whitespace-nowrap">
              Intervalle (min):
            </Label>
            <Input
              id="sync-interval"
              type="number"
              min={1}
              max={60}
              className="w-20 h-8"
              value={syncInterval}
              onChange={(e) => setSyncInterval(parseInt(e.target.value) || 5)}
              disabled={isLoading || isSaving}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto h-8" 
              onClick={handleSaveSettings}
              disabled={isLoading || isSaving}
            >
              Enregistrer
            </Button>
          </div>
          
          {/* Statut de la dernière synchronisation */}
          <div className="text-xs space-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {lastSync 
                  ? `Dernière synchro: ${formatDistanceToNow(new Date(lastSync), { addSuffix: true, locale: fr })}`
                  : "Aucune synchronisation récente"}
              </span>
            </div>
            
            {syncStatus && (
              <div className="flex items-center gap-1.5">
                {syncStatus === 'success' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <span className={syncStatus === 'success' ? "text-green-600" : "text-red-500"}>
                  {syncStatus === 'success' ? "Synchronisation réussie" : "Échec de la synchronisation"}
                </span>
              </div>
            )}
            
            {syncError && (
              <div className="text-red-500 mt-1 pl-4">
                Erreur: {syncError}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={handleTriggerSync}
            disabled={isLoading || isCheckingStatus}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Synchroniser maintenant
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoogleAutoSync;
