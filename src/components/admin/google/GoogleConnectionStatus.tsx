
import React from "react";
import { X } from "lucide-react";
interface GoogleConnectionStatusProps {
  isConnected: boolean;
}
const GoogleConnectionStatus: React.FC<GoogleConnectionStatusProps> = ({
  isConnected
}) => {
  if (isConnected) {
    return null;
  }
  return <div className="flex items-center gap-1">
      <X className="h-3 w-3 text-red-600" />
      Synchronisation Google Calendar désactivée
    </div>;
};
export default GoogleConnectionStatus;
