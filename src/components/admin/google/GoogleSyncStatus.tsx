
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import GoogleAutoSyncStatus from "./GoogleAutoSyncStatus";
import GoogleSyncLogs from "./GoogleSyncLogs";

interface GoogleSyncStatusProps {
  lastSyncTimestamp?: string;
  lastSyncStatus?: string;
  syncError?: string;
  onSync: () => Promise<void>;
}

interface CronJobInfo {
  jobid: string;
  schedule: string;
  command: string;
  active: boolean;
  last_run_time: string | null;
}

const GoogleSyncStatus: React.FC<GoogleSyncStatusProps> = ({
  lastSyncTimestamp,
  lastSyncStatus,
  syncError,
  onSync
}) => {
  const [cronJob, setCronJob] = useState<CronJobInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  const checkCronJob = async () => {
    setLoading(true);
    try {
      // Cette requête doit être exécutée avec des privilèges élevés (rpc ou fonction)
      const { data, error } = await supabase.rpc('check_auto_sync_cron_job');
      
      if (error) {
        console.error("Erreur lors de la vérification de la tâche CRON:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setCronJob(data[0]);
      }
    } catch (error) {
      console.error("Exception lors de la vérification de la tâche CRON:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkCronJob();
  }, []);

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">État de la synchronisation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="status" className="flex-1">État actuel</TabsTrigger>
            <TabsTrigger value="cron" className="flex-1">Configuration CRON</TabsTrigger>
            <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            <GoogleAutoSyncStatus
              lastSyncTimestamp={lastSyncTimestamp}
              lastSyncStatus={lastSyncStatus}
              syncError={syncError}
              onSync={onSync}
            />
          </TabsContent>
          
          <TabsContent value="cron">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Configuration de la tâche CRON</h3>
              
              {loading ? (
                <div className="text-sm text-muted-foreground">Chargement des informations...</div>
              ) : cronJob ? (
                <div className="text-xs space-y-2">
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium">Job ID:</span>
                    <span>{cronJob.jobid}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium">Planification:</span>
                    <span>{cronJob.schedule}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium">Commande:</span>
                    <code className="text-xs bg-muted p-1 rounded block whitespace-pre-wrap break-all">
                      {cronJob.command}
                    </code>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium">État:</span>
                    <span className={`font-medium ${cronJob.active ? 'text-green-500' : 'text-red-500'}`}>
                      {cronJob.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-medium">Dernière exécution:</span>
                    <span>{cronJob.last_run_time || 'Jamais exécuté'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-amber-500">
                  Aucune tâche CRON n'a été trouvée pour la synchronisation automatique. 
                  Contactez votre administrateur pour configurer la synchronisation périodique.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <GoogleSyncLogs />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GoogleSyncStatus;
