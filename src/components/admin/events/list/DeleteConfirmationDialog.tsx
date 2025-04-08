
import React, { useState, useEffect } from "react";
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
  const [isSuccess, setIsSuccess] = useState(false);

  // Assurer la fermeture automatique après une suppression réussie
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        onClose();
      }, 300);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess, onClose]);

  const handleConfirm = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log("[DIALOG] Début de la suppression pour:", eventTitle);
    
    try {
      await onConfirm();
      console.log("[DIALOG] Suppression terminée avec succès");
      setIsSuccess(true);
    } catch (error) {
      console.error("[DIALOG] Erreur lors de la suppression:", error);
      setIsSuccess(false);
      // Ne pas fermer automatiquement en cas d'erreur
    } finally {
      setIsDeleting(false);
      // Ne pas fermer ici, attendre l'effet pour la fermeture automatique
    }
  };

  const handleCancel = () => {
    if (isDeleting) return; // Empêcher l'annulation pendant la suppression
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
