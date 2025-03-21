
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface TimeSlotFormProps {
  timeSlots: string[];
  onAddTimeSlot: (newTimeSlots: string[]) => void;
}

const TimeSlotForm: React.FC<TimeSlotFormProps> = ({ timeSlots, onAddTimeSlot }) => {
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");

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

    onAddTimeSlot(updatedTimeSlots);
    setNewTimeSlot("");
  };

  return (
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
  );
};

export default TimeSlotForm;
