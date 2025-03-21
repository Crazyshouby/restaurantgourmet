
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminSettings } from "@/types";

// Import our components
import TimeSlotList from "./capacity/TimeSlotList";
import TimeSlotForm from "./capacity/TimeSlotForm";
import MaxGuestsInput from "./capacity/MaxGuestsInput";

interface CapacitySettingsProps {
  adminSettings: AdminSettings;
  onSettingsUpdated: () => void;
  isLoading: boolean;
}

const CapacitySettings: React.FC<CapacitySettingsProps> = ({
  adminSettings,
  onSettingsUpdated,
  isLoading
}) => {
  const [timeSlots, setTimeSlots] = useState<string[]>(adminSettings.timeSlots || [
    "12:00", "12:30", "13:00", "13:30", 
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ]);
  const [maxGuestsPerDay, setMaxGuestsPerDay] = useState<number>(
    adminSettings.maxGuestsPerDay || 20
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (adminSettings.timeSlots) {
      setTimeSlots(adminSettings.timeSlots);
    }
    if (adminSettings.maxGuestsPerDay) {
      setMaxGuestsPerDay(adminSettings.maxGuestsPerDay);
    }
  }, [adminSettings]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('admin_settings')
        .update({
          time_slots: timeSlots,
          max_guests_per_day: maxGuestsPerDay,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      
      if (error) {
        throw error;
      }
      
      toast.success("Paramètres enregistrés", {
        description: "Les paramètres de capacité ont été mis à jour."
      });
      
      if (onSettingsUpdated) {
        onSettingsUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      toast.error("Erreur d'enregistrement", {
        description: "Impossible d'enregistrer les paramètres."
      });
    } finally {
      setIsSaving(false);
    }
  };

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

export default CapacitySettings;
