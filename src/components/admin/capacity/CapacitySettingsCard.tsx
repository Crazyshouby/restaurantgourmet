
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";
import { AdminSettings } from "@/types";
import MaxGuestsInput from "./MaxGuestsInput";
import TimeSlotList from "./TimeSlotList";
import TimeSlotForm from "./TimeSlotForm";
import useCapacitySettings from "@/hooks/useCapacitySettings";

interface CapacitySettingsCardProps {
  adminSettings: AdminSettings;
  onSettingsUpdated: () => Promise<void>;
  isLoading: boolean;
}

const CapacitySettingsCard: React.FC<CapacitySettingsCardProps> = ({
  adminSettings,
  onSettingsUpdated,
  isLoading
}) => {
  const { 
    timeSlots, 
    maxGuestsPerDay, 
    isSaving, 
    handleSaveSettings,
    setTimeSlots,
    setMaxGuestsPerDay
  } = useCapacitySettings(adminSettings, onSettingsUpdated);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h3 className="font-medium">Paramètres de capacité</h3>
      </div>
      
      <div className="space-y-4">
        <MaxGuestsInput 
          maxGuestsPerDay={maxGuestsPerDay} 
          onMaxGuestsChange={setMaxGuestsPerDay} 
        />
        
        <TimeSlotList 
          timeSlots={timeSlots} 
          onRemoveTimeSlot={(slot) => setTimeSlots(timeSlots.filter(s => s !== slot))} 
        />
        
        <TimeSlotForm 
          timeSlots={timeSlots} 
          onAddTimeSlot={setTimeSlots} 
        />
      </div>
      
      <Button 
        onClick={handleSaveSettings} 
        className="w-full"
        disabled={isSaving || isLoading}
      >
        <Save className="h-4 w-4 mr-2" />
        Enregistrer les paramètres
      </Button>
    </div>
  );
};

export default CapacitySettingsCard;
