
import React from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";
import { formatPhoneNumber } from "@/utils/formatters";
import ReservationForm, { EditReservationFormData } from "./reservation/ReservationForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationEditModalProps {
  reservation: Reservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationUpdated: () => void;
}

const ReservationEditModal: React.FC<ReservationEditModalProps> = ({
  reservation,
  open,
  onOpenChange,
  onReservationUpdated,
}) => {
  const handleSubmit = async (data: EditReservationFormData) => {
    if (!reservation) return;

    // Format the phone number before submitting
    const formattedData = {
      ...data,
      phone: formatPhoneNumber(data.phone)
    };

    try {
      const success = await ReservationService.updateReservation({
        ...reservation,
        ...formattedData,
      });

      if (success) {
        toast.success("Réservation mise à jour", {
          description: "La réservation a été modifiée avec succès.",
        });
        onOpenChange(false);
        onReservationUpdated();
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
    }
  };

  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Modifier la réservation
          </DialogTitle>
        </DialogHeader>

        <ReservationForm
          reservation={reservation}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservationEditModal;
