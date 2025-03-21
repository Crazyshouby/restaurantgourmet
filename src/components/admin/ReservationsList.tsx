
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { Reservation } from "@/types";
import ReservationEditModal from "./ReservationEditModal";
import ReservationDayGroup from "./reservation/ReservationDayGroup";
import EmptyReservationState from "./reservation/EmptyReservationState";
import { useReservationsByDay } from "@/hooks/useReservationsByDay";
import { useReservationManagement } from "@/hooks/useReservationManagement";

interface ReservationsListProps {
  reservations: Reservation[];
  onReservationDeleted?: () => void;
  onReservationUpdated?: () => void;
}

const ReservationsList: React.FC<ReservationsListProps> = ({ 
  reservations,
  onReservationDeleted,
  onReservationUpdated
}) => {
  const reservationsByDay = useReservationsByDay(reservations);
  
  const { 
    selectedReservation, 
    isEditModalOpen, 
    setIsEditModalOpen, 
    handleDelete, 
    handleEdit 
  } = useReservationManagement(() => {
    if (onReservationDeleted) onReservationDeleted();
    if (onReservationUpdated) onReservationUpdated();
  });

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Réservations récentes
          </CardTitle>
          <CardDescription>
            Aperçu des dernières réservations effectuées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsByDay.length > 0 ? (
            <div className="space-y-4">
              {reservationsByDay.map((dayGroup) => (
                <ReservationDayGroup
                  key={dayGroup.date.toISOString()}
                  date={dayGroup.date}
                  reservations={dayGroup.items}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyReservationState />
          )}
        </CardContent>
      </Card>

      <ReservationEditModal
        reservation={selectedReservation}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onReservationUpdated={onReservationUpdated}
      />
    </>
  );
};

export default ReservationsList;
