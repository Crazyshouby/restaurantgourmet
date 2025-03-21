
import { useState } from "react";
import { toast } from "sonner";
import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";

export function useReservationManagement(onReservationChanged?: () => void) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    if (isDeleting) return; // Évite les clics multiples

    setIsDeleting(true);
    try {
      const success = await ReservationService.deleteReservation(id);
      
      if (success) {
        toast.success("Réservation supprimée", {
          description: "La réservation a été supprimée avec succès."
        });
        
        if (onReservationChanged) {
          onReservationChanged();
        }
      } else {
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer la réservation."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur de suppression", {
        description: "Une erreur est survenue lors de la suppression."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  return {
    selectedReservation,
    isEditModalOpen,
    setIsEditModalOpen,
    handleDelete,
    handleEdit
  };
}
