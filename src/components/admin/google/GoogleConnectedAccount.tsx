import React from "react";
import GoogleSyncActions from "./GoogleSyncActions";
interface GoogleConnectedAccountProps {
  email: string | undefined;
  onSyncToGoogle: () => Promise<void>;
  onImportFromGoogle: () => Promise<void>;
  isLoading: boolean;
}
const GoogleConnectedAccount: React.FC<GoogleConnectedAccountProps> = ({
  email,
  onSyncToGoogle,
  onImportFromGoogle,
  isLoading
}) => {
  return <div className="rounded-md bg-muted p-2 text-xs py-[17px]">
      <div className="font-medium mb-1">Compte connecté :</div>
      <div className="text-muted-foreground mb-1">{email}</div>
      <GoogleSyncActions onSyncToGoogle={onSyncToGoogle} onImportFromGoogle={onImportFromGoogle} isLoading={isLoading} />
    </div>;
};
export default GoogleConnectedAccount;