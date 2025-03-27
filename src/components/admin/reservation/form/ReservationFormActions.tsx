
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ReservationFormActionsProps {
  onCancel: () => void;
}

const ReservationFormActions: React.FC<ReservationFormActionsProps> = ({ onCancel }) => {
  return (
    <DialogFooter>
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button type="submit">Enregistrer</Button>
    </DialogFooter>
  );
};

export default ReservationFormActions;
