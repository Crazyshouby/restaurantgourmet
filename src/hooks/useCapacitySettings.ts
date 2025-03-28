
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSettings } from "@/types";
import { toast } from "sonner";

export default function useCapacitySettings(
  adminSettings: AdminSettings,
  onSettingsUpdated: () => Promise<void>
) {
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
        await onSettingsUpdated();
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

  return {
    timeSlots,
    setTimeSlots,
    maxGuestsPerDay,
    setMaxGuestsPerDay,
    isSaving,
    handleSaveSettings
  };
}
