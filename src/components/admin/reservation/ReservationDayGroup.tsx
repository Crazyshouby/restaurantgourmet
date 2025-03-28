
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Reservation } from "@/types";
import ReservationItem from "./ReservationItem";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      {/* Afficher la date avec un séparateur à gauche et une icône pour montrer/cacher */}
      <div 
        className="flex items-center gap-2 py-3 cursor-pointer" 
        onClick={toggleExpanded}
      >
        <Separator className="w-12" />
        <span className="text-sm font-medium text-muted-foreground capitalize whitespace-nowrap">
          {formatDate(date)}
        </span>
        <div className="ml-auto text-muted-foreground">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      {/* Liste des réservations du jour, conditionnellement affichée */}
      {isExpanded && (
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
      )}
    </div>
  );
};

export default ReservationDayGroup;
