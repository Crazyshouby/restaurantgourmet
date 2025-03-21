
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Reservation } from "@/types";
import ReservationItem from "./ReservationItem";

interface ReservationDayGroupProps {
  date: Date;
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const ReservationDayGroup: React.FC<ReservationDayGroupProps> = ({
  date,
  reservations,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  return (
    <div>
      {/* Afficher la date avec un séparateur à gauche */}
      <div className="flex items-center gap-2 py-3">
        <Separator className="w-12" />
        <span className="text-sm font-medium text-muted-foreground capitalize whitespace-nowrap">
          {formatDate(date)}
        </span>
      </div>
      
      {/* Liste des réservations du jour */}
      <div className="space-y-3">
        {reservations.map((reservation) => (
          <ReservationItem
            key={reservation.id}
            reservation={reservation}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationDayGroup;
