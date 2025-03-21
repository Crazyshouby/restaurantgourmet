import React from "react";
import { Check, X } from "lucide-react";
interface GoogleConnectionStatusProps {
  isConnected: boolean;
}
const GoogleConnectionStatus: React.FC<GoogleConnectionStatusProps> = ({
  isConnected
}) => {
  if (isConnected) {
    return <div className="flex items-center gap-1 mx-0 my-[6px] px-[16px] py-[8px]">
        <Check className="h-3 w-3 text-green-600" />
        Les réservations sont automatiquement synchronisées
      </div>;
  }
  return <div className="flex items-center gap-1">
      <X className="h-3 w-3 text-red-600" />
      Synchronisation Google Calendar désactivée
    </div>;
};
export default GoogleConnectionStatus;