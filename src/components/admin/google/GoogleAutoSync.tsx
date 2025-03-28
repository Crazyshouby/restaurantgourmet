
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ReservationService } from "@/services/ReservationService";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";

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
  const [reconnectionNeeded, setReconnectionNeeded] = useState(false);

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
      setReconnectionNeeded(status.reconnectionNeeded);
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
    if (isLoading || reconnectionNeeded) return;
    
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
        if (result.reconnectionNeeded) {
          // Afficher un message d'erreur spécifique pour les problèmes de token
          toast.error("Connexion Google expirée", {
            description: "Veuillez vous reconnecter à votre compte Google pour continuer la synchronisation."
          });
          setReconnectionNeeded(true);
        } else {
          toast.error("Erreur de synchronisation", {
            description: result.error || "Une erreur est survenue lors de la synchronisation."
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du déclenchement de la synchronisation:", error);
      toast.error("Erreur de synchronisation", {
        description: "Impossible de déclencher la synchronisation."
      });
    }
  };

  const handleResetConnection = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // D'abord déconnecter Google
      await GoogleCalendarService.disconnect();
      
      // Réinitialiser les paramètres de connexion
      await ReservationService.resetGoogleConnection();
      
      toast.success("Connexion réinitialisée", {
        description: "La connexion à Google a été réinitialisée. Vous pouvez maintenant vous reconnecter."
      });
      
      setReconnectionNeeded(false);
      
      // Recharger les paramètres
      if (onStatusChanged) await onStatusChanged();
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de la connexion:", error);
      toast.error("Erreur de réinitialisation", {
        description: "Impossible de réinitialiser la connexion à Google."
      });
    } finally {
      setIsLoading(false);
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
          disabled={isLoading || isSaving || reconnectionNeeded}
          className={autoSyncEnabled ? "data-[state=checked]:bg-green-500" : ""}
          onCheckedChange={setAutoSyncEnabled}
        />
      </div>
      
      {reconnectionNeeded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-800">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p>Reconnexion nécessaire</p>
          </div>
          <p className="mt-1">La connexion avec Google a expiré. Veuillez réinitialiser la connexion puis reconnecter votre compte Google.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            onClick={handleResetConnection}
            disabled={isLoading}
          >
            Réinitialiser la connexion
          </Button>
        </div>
      )}
      
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
              disabled={isLoading || isSaving || reconnectionNeeded}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto h-8" 
              onClick={handleSaveSettings}
              disabled={isLoading || isSaving || reconnectionNeeded}
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
            disabled={isLoading || isCheckingStatus || reconnectionNeeded}
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
