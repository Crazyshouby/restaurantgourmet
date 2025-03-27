
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reservation } from "@/types";
import { Form } from "@/components/ui/form";
import ReservationFormFields from "./form/ReservationFormFields";
import ReservationFormActions from "./form/ReservationFormActions";

// Schéma de validation pour le formulaire
const editReservationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(5, "Le numéro de téléphone est obligatoire"),
  email: z.string().email("L'email doit être valide"),
  guests: z.coerce.number().min(1, "Au moins 1 invité est requis"),
  time: z.string().min(1, "L'heure est obligatoire"),
  notes: z.string().optional(),
});

export type EditReservationFormData = z.infer<typeof editReservationSchema>;

interface ReservationFormProps {
  reservation: Reservation;
  onSubmit: (data: EditReservationFormData) => Promise<void>;
  onCancel: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  reservation,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<EditReservationFormData>({
    resolver: zodResolver(editReservationSchema),
    defaultValues: {
      name: reservation?.name || "",
      phone: reservation?.phone || "",
      email: reservation?.email || "",
      guests: reservation?.guests || 1,
      time: reservation?.time || "",
      notes: reservation?.notes || "",
    },
  });

  // Met à jour les valeurs du formulaire lorsque la réservation change
  React.useEffect(() => {
    if (reservation) {
      form.reset({
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email,
        guests: reservation.guests,
        time: reservation.time,
        notes: reservation.notes || "",
      });
    }
  }, [reservation, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ReservationFormFields 
          form={form}
          reservation={reservation}
        />
        
        <ReservationFormActions onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default ReservationForm;
