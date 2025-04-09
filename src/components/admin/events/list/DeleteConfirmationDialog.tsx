
import React from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface DeleteConfirmationDialogProps {
  eventTitle: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ 
  eventTitle, 
  onConfirm,
  isLoading = false
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet événement ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action est irréversible. L'événement "{eventTitle}" sera définitivement supprimé.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
        <AlertDialogAction 
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
          disabled={isLoading}
          className="relative"
        >
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </span>
          )}
          <span className={isLoading ? "opacity-0" : ""}>
            Supprimer
          </span>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteConfirmationDialog;
