
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface GoogleAutoSyncStatusProps {
  lastSyncTimestamp?: string;
  lastSyncStatus?: string;
  syncError?: string;
  onSync: () => Promise<void>;
}

const GoogleAutoSyncStatus: React.FC<GoogleAutoSyncStatusProps> = ({
  lastSyncTimestamp,
  lastSyncStatus,
  syncError,
  onSync
}) => {
  // Formatage du timestamp pour affichage
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return "date inconnue";
    }
  };

  return (
    <div className="w-full space-y-2 pt-2 border-t">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Synchronisation automatique</span>
        
        {lastSyncStatus === "error" ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle size={12} />
            Erreur
          </Badge>
        ) : lastSyncStatus === "success" ? (
          <Badge variant="default" className="bg-green-50 text-green-800 hover:bg-green-100 dark:bg-green-50 dark:text-green-800">
            <CheckCircle2 size={12} className="mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary">
            Inconnue
          </Badge>
        )}
      </div>
      
      {lastSyncTimestamp && (
        <div className="text-xs text-muted-foreground">
          Dernière synchronisation: {formatTimestamp(lastSyncTimestamp)}
        </div>
      )}
      
      {syncError && (
        <div className="text-xs text-red-500 flex items-start gap-1 mt-1">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
          <span>{syncError}</span>
        </div>
      )}
      
      {lastSyncStatus === "error" && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-xs h-8"
          onClick={onSync}
        >
          <RefreshCcw size={12} className="mr-1" />
          Réessayer la synchronisation
        </Button>
      )}
    </div>
  );
};

export default GoogleAutoSyncStatus;
