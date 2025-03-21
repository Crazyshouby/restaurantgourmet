
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Reservation } from "@/types";
import EmptyReservationState from "@/components/admin/reservation/EmptyReservationState";

interface DayReservationsListProps {
  selectedDay: Date;
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const DayReservationsList: React.FC<DayReservationsListProps> = ({
  selectedDay,
  reservations,
  onEdit,
  onDelete
}) => {
  return (
    <div className="mt-6 border rounded-md p-4">
      <h3 className="font-medium mb-3 capitalize">
        {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
      </h3>
      
      {reservations.length > 0 ? (
        <div className="space-y-3">
          {reservations.map(reservation => (
            <div 
              key={reservation.id}
              className="p-3 border rounded-md hover:bg-accent/10 cursor-pointer transition-colors"
              onClick={() => onEdit(reservation)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{reservation.time}</span>
                  <h4 className="font-medium">{reservation.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(reservation);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(reservation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {reservation.notes && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <Separator className="my-2" />
                  {reservation.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyReservationState />
      )}
    </div>
  );
};

export default DayReservationsList;
