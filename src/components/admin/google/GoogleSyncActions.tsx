import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
interface GoogleSyncActionsProps {
  onSyncToGoogle: () => Promise<void>;
  onImportFromGoogle: () => Promise<void>;
  isLoading: boolean;
}
const GoogleSyncActions: React.FC<GoogleSyncActionsProps> = ({
  onSyncToGoogle,
  onImportFromGoogle,
  isLoading
}) => {
  return <div className="space-y-1">
      <Button variant="outline" size="sm" onClick={onSyncToGoogle} disabled={isLoading} className="w-full h-8 text-xs my-[9px]">
        <RefreshCw className="h-3 w-3 mr-1" />
        Synchroniser vers Google
      </Button>
      <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={onImportFromGoogle} disabled={isLoading}>
        <Download className="h-3 w-3 mr-1" />
        Importer depuis Google
      </Button>
    </div>;
};
export default GoogleSyncActions;