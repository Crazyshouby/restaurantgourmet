
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface SyncLog {
  id: string;
  message: string;
  log_type: "info" | "error" | "success";
  details: any;
  created_at: string;
}

const GoogleSyncLogs: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Récupérer les logs de synchronisation
  const fetchSyncLogs = async () => {
    setIsLoading(true);
    try {
      // For tables not in the TypeScript definition, use an RPC call
      const { data, error } = await supabase.rpc('get_sync_logs', {}) as unknown as { 
        data: SyncLog[] | null;
        error: any;
      };
      
      if (error) throw error;
      
      setLogs(data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Erreur lors de la récupération des logs de synchronisation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncLogs();
  }, []);

  // Formater la date pour l'affichage
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')} (${formatDistanceToNow(date, { addSuffix: true, locale: fr })})`;
    } catch (error) {
      return timestamp;
    }
  };

  // Obtenir l'icône correspondant au type de log
  const getLogIcon = (type: "info" | "error" | "success") => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Obtenir la couleur de badge correspondant au type de log
  const getBadgeVariant = (type: "info" | "error" | "success") => {
    switch (type) {
      case "success":
        return "outline";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Logs de synchronisation</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchSyncLogs}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground mb-2">
        Dernière actualisation: {formatDistanceToNow(lastRefresh, { addSuffix: true, locale: fr })}
      </div>

      <ScrollArea className="h-[300px] border rounded-md p-2">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucun log de synchronisation disponible
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border-b pb-2 last:border-0">
                <div className="flex items-start gap-2">
                  {getLogIcon(log.log_type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{log.message}</span>
                      <Badge variant={getBadgeVariant(log.log_type)} className="text-[10px] h-5">
                        {log.log_type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(log.created_at)}
                    </div>
                    {log.details && (
                      <details className="mt-1">
                        <summary className="text-xs text-blue-500 cursor-pointer">Détails</summary>
                        <pre className="text-[10px] bg-muted p-1 mt-1 rounded max-w-full overflow-x-auto">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default GoogleSyncLogs;
