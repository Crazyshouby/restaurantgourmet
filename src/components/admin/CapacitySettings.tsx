
import React from "react";
import { AdminSettings } from "@/types";
import CapacitySettingsCard from "./capacity/CapacitySettingsCard";

interface CapacitySettingsProps {
  adminSettings: AdminSettings;
  onSettingsUpdated: () => Promise<void>;
  isLoading: boolean;
}

const CapacitySettings: React.FC<CapacitySettingsProps> = ({
  adminSettings,
  onSettingsUpdated,
  isLoading
}) => {
  return (
    <CapacitySettingsCard
      adminSettings={adminSettings}
      onSettingsUpdated={onSettingsUpdated}
      isLoading={isLoading}
    />
  );
};

export default CapacitySettings;
