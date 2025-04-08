
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AdminSettings } from "@/types";

interface GoogleConnectionToggleProps {
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const GoogleConnectionToggle: React.FC<GoogleConnectionToggleProps> = ({
  isConnected,
  isLoading,
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="google-sync" className="text-sm">Synchronisation</Label>
      <Switch 
        id="google-sync" 
        checked={isConnected}
        disabled={isLoading}
        onCheckedChange={(checked) => {
          if (checked) {
            onConnect();
          } else {
            onDisconnect();
          }
        }}
      />
    </div>
  );
};

export default GoogleConnectionToggle;
