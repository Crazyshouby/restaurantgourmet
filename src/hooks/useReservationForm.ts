
import { useState } from "react";
import { toast } from "sonner";
import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";
import { EditReservationFormData } from "@/components/admin/reservation/ReservationForm";

interface UseReservationFormOptions {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useReservationForm = ({ onSuccess, onClose }: UseReservationFormOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (reservation: Reservation, data: EditReservationFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await ReservationService.updateReservation({
        ...reservation,
        ...data,
      });

      if (success) {
        toast.success("Réservation mise à jour", {
          description: "La réservation a été modifiée avec succès.",
        });
        
        if (onClose) onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error("Erreur de mise à jour", {
          description: "Impossible de mettre à jour la réservation.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur de mise à jour", {
        description: "Une erreur est survenue lors de la mise à jour.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
};
