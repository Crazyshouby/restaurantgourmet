
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSettings } from "@/types";
import GoogleIcon from "./google/GoogleIcon";
import GoogleConnectionManager from "./google/GoogleConnectionManager";
import GoogleSyncControls from "./google/GoogleSyncControls";
import GoogleConnectionStatus from "./google/GoogleConnectionStatus";
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
  const handleConnectionUpdated = (settings: Partial<AdminSettings>) => {
    setAdminSettings({
      ...adminSettings,
      ...settings
    });
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
        <GoogleConnectionManager 
          isConnected={adminSettings.googleConnected}
          isLoading={isLoading}
          onConnectionUpdated={handleConnectionUpdated}
          setIsLoading={setIsLoading}
        />
        
        {adminSettings.googleConnected && (
          <GoogleSyncControls
            email={adminSettings.googleEmail}
            isLoading={isLoading}
            lastSyncTimestamp={adminSettings.lastSyncTimestamp}
            lastSyncStatus={adminSettings.lastSyncStatus}
            syncError={adminSettings.syncError}
            onRefreshReservations={onRefreshReservations}
            onSettingsUpdated={onSettingsUpdated}
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
