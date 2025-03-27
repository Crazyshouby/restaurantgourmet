
import React from "react";
import { Button } from "@/components/ui/button";

interface MenuItemFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const MenuItemFormActions: React.FC<MenuItemFormActionsProps> = ({ onCancel, isEditing }) => {
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

export default MenuItemFormActions;
