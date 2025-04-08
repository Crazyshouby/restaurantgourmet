
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
  onClose: () => void;
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
    console.log("[DIALOG] Début de la suppression pour:", eventTitle);
    
    try {
      await onConfirm();
      console.log("[DIALOG] Suppression terminée avec succès");
    } catch (error) {
      console.error("[DIALOG] Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      onClose(); // Fermer la boîte de dialogue dans tous les cas
    }
  };

  const handleCancel = () => {
    console.log("[DIALOG] Annulation de la suppression");
    onClose();
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
