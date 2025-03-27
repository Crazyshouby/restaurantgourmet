
import React from "react";
import { Button } from "@/components/ui/button";

interface EventFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const EventFormActions: React.FC<EventFormActionsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit">
        {isEditing ? "Mettre à jour" : "Ajouter"}
      </Button>
    </div>
  );
};

export default EventFormActions;
