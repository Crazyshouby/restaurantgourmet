
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, PlusCircle, Clock, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminSettings } from "@/types";

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
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (adminSettings.timeSlots) {
      setTimeSlots(adminSettings.timeSlots);
    }
    if (adminSettings.maxGuestsPerDay) {
      setMaxGuestsPerDay(adminSettings.maxGuestsPerDay);
    }
  }, [adminSettings]);

  const handleAddTimeSlot = () => {
    if (!newTimeSlot) {
      toast.error("Veuillez entrer une heure");
      return;
    }

    // Simple time format validation (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newTimeSlot)) {
      toast.error("Format d'heure invalide. Utilisez HH:MM");
      return;
    }

    if (timeSlots.includes(newTimeSlot)) {
      toast.error("Cette heure existe déjà");
      return;
    }

    // Add and sort time slots
    const updatedTimeSlots = [...timeSlots, newTimeSlot].sort((a, b) => {
      return a.localeCompare(b);
    });

    setTimeSlots(updatedTimeSlots);
    setNewTimeSlot("");
  };

  const handleRemoveTimeSlot = (slot: string) => {
    setTimeSlots(timeSlots.filter(s => s !== slot));
  };

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
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres de capacité
        </CardTitle>
        <CardDescription>
          Définissez les plages horaires et la capacité journalière
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxGuests">Nombre maximum de personnes par jour</Label>
            <Input
              id="maxGuests"
              type="number"
              value={maxGuestsPerDay}
              onChange={(e) => setMaxGuestsPerDay(Number(e.target.value))}
              className="w-24 text-right"
              min={1}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Plages horaires disponibles</Label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <div 
                  key={slot}
                  className="flex items-center bg-muted rounded-md px-3 py-1"
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span className="text-sm">{slot}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1.5 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveTimeSlot(slot)}
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter une heure (HH:MM)"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={handleAddTimeSlot}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={isSaving || isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default CapacitySettings;
