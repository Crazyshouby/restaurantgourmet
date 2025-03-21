
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Reservation } from "@/types";
import { formatPhoneNumber } from "@/utils/formatters";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

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

  // Handler pour le champ de téléphone pour appliquer le format en temps réel
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setValue('phone', formattedValue);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2">
          Date: {reservation.date instanceof Date 
            ? format(reservation.date, 'EEEE d MMMM yyyy', { locale: fr }) 
            : format(new Date(reservation.date), 'EEEE d MMMM yyyy', { locale: fr })}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input {...field} onChange={handlePhoneChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de personnes</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ReservationForm;
