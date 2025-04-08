
import React, { useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  eventTitle: string;
  onConfirm: () => Promise<void>;
  onClose: () => void; // Ajout d'une fonction explicite pour fermer
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ 
  eventTitle, 
  onConfirm,
  onClose
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log("DeleteConfirmationDialog - Début de la suppression");
    
    try {
      await onConfirm();
      console.log("DeleteConfirmationDialog - Suppression terminée avec succès");
      // Fermer explicitement le dialogue après succès
      onClose();
    } catch (error) {
      console.error("DeleteConfirmationDialog - Erreur lors de la suppression:", error);
      setIsDeleting(false); // Réinitialiser l'état seulement en cas d'erreur
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet événement ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action est irréversible. L'événement "{eventTitle}" sera définitivement supprimé.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>Annuler</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleConfirm}
          disabled={isDeleting}
          className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isDeleting ? "Suppression en cours..." : "Supprimer"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteConfirmationDialog;
