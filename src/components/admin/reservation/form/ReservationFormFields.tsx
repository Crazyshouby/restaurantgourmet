
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { EditReservationFormData } from "../ReservationForm";
import { Reservation } from "@/types";
import { formatPhoneNumber } from "@/utils/formatters";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReservationFormFieldsProps {
  form: UseFormReturn<EditReservationFormData>;
  reservation: Reservation;
}

const ReservationFormFields: React.FC<ReservationFormFieldsProps> = ({
  form,
  reservation
}) => {
  // Handler pour le champ de téléphone pour appliquer le format en temps réel
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setValue('phone', formattedValue);
  };

  return (
    <>
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
    </>
  );
};

export default ReservationFormFields;
