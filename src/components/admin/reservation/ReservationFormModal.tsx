
import React from "react";
import { Reservation } from "@/types";
import ReservationForm, { EditReservationFormData } from "./ReservationForm";
import { useReservationForm } from "@/hooks/useReservationForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface ReservationFormModalProps {
  reservation: Reservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationUpdated: () => void;
}

const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  reservation,
  open,
  onOpenChange,
  onReservationUpdated,
}) => {
  const { handleSubmit } = useReservationForm({
    onSuccess: onReservationUpdated,
    onClose: () => onOpenChange(false)
  });

  const onSubmit = async (data: EditReservationFormData) => {
    if (!reservation) return;
    await handleSubmit(reservation, data);
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
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservationFormModal;
