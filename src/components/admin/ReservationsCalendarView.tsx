
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";
import ReservationEditModal from "./ReservationEditModal";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarGrid from "./calendar/CalendarGrid";
import DayReservationsList from "./calendar/DayReservationsList";
import { useCalendarState, colStartClasses } from "./calendar/useCalendarState";

interface ReservationsCalendarViewProps {
  reservations: Reservation[];
  onReservationUpdated: () => void;
  onReservationDeleted: () => void;
}

const ReservationsCalendarView: React.FC<ReservationsCalendarViewProps> = ({
  reservations,
  onReservationUpdated,
  onReservationDeleted
}) => {
  const {
    today,
    selectedDay,
    setSelectedDay,
    firstDayCurrentMonth,
    days,
    previousMonth,
    nextMonth,
    goToToday,
    selectedReservation,
    setSelectedReservation,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEdit,
    getReservationsForDay
  } = useCalendarState(reservations);

  const handleDelete = async (id: string) => {
    try {
      const success = await ReservationService.deleteReservation(id);
      
      if (success) {
        toast.success("Réservation supprimée", {
          description: "La réservation a été supprimée avec succès."
        });
        onReservationDeleted();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur de suppression", {
        description: "Une erreur est survenue lors de la suppression."
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5" />
          Calendrier des réservations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header du calendrier */}
        <CalendarHeader 
          firstDayCurrentMonth={firstDayCurrentMonth}
          today={today}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
          goToToday={goToToday}
        />

        {/* Grid du calendrier */}
        <CalendarGrid 
          days={days}
          firstDayCurrentMonth={firstDayCurrentMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          colStartClasses={colStartClasses}
          getReservationsForDay={getReservationsForDay}
          onReservationSelect={handleEdit}
        />

        {/* Liste des réservations pour le jour sélectionné */}
        <DayReservationsList 
          selectedDay={selectedDay}
          reservations={getReservationsForDay(selectedDay)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </CardContent>
      
      <ReservationEditModal
        reservation={selectedReservation}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onReservationUpdated={onReservationUpdated}
      />
    </Card>
  );
};

export default ReservationsCalendarView;
