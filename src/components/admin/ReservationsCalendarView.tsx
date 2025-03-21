
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarRange,
  Edit, 
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";
import { toast } from "sonner";
import ReservationEditModal from "./ReservationEditModal";

interface ReservationsCalendarViewProps {
  reservations: Reservation[];
  onReservationUpdated: () => void;
  onReservationDeleted: () => void;
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const ReservationsCalendarView: React.FC<ReservationsCalendarViewProps> = ({
  reservations,
  onReservationUpdated,
  onReservationDeleted
}) => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }), // Semaine commence le lundi
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  });

  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

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

  // Mappez les réservations pour les afficher dans le calendrier
  const getReservationsForDay = (day: Date) => {
    return reservations.filter(reservation => {
      const reservationDate = reservation.date instanceof Date 
        ? reservation.date 
        : new Date(reservation.date);
      return isSameDay(reservationDate, day);
    }).sort((a, b) => a.time.localeCompare(b.time));
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
        <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex sm:flex-col sm:items-center sm:justify-center rounded-lg border bg-muted p-0.5">
              <div className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM", { locale: fr })}
              </div>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 px-2 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-foreground capitalize">
                {format(firstDayCurrentMonth, "MMMM yyyy", { locale: fr })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "d MMM", { locale: fr })} - {format(endOfMonth(firstDayCurrentMonth), "d MMM", { locale: fr })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg shadow-sm">
              <Button
                onClick={previousMonth}
                variant="outline"
                size="icon"
                className="rounded-r-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={goToToday}
                variant="outline"
                className="rounded-none border-x-0"
              >
                Aujourd'hui
              </Button>
              <Button
                onClick={nextMonth}
                variant="outline"
                size="icon"
                className="rounded-l-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grid du calendrier */}
        <div className="flex flex-col">
          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold border">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
              <div key={i} className={i < 6 ? "border-r py-2" : "py-2"}>
                {day}
              </div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 grid-rows-6 border-x">
            {days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                onClick={() => setSelectedDay(day)}
                className={`
                  ${dayIdx === 0 ? colStartClasses[getDay(day) === 0 ? 7 : getDay(day)] : ""}
                  ${
                    !isSameMonth(day, firstDayCurrentMonth)
                      ? "bg-accent/30 text-muted-foreground"
                      : "bg-background"
                  }
                  ${isEqual(day, selectedDay) ? "bg-accent/60" : ""}
                  ${isToday(day) ? "font-bold" : ""}
                  relative min-h-[100px] border-b border-r p-1 cursor-pointer hover:bg-accent/40
                `}
              >
                <div className="flex justify-between">
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={`
                      ${isToday(day) ? "bg-primary text-primary-foreground" : ""}
                      ${
                        isEqual(day, selectedDay) && !isToday(day)
                          ? "bg-accent/80"
                          : ""
                      }
                      h-6 w-6 flex items-center justify-center rounded-full text-sm
                    `}
                  >
                    {format(day, "d")}
                  </time>
                  
                  {getReservationsForDay(day).length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getReservationsForDay(day).length}
                    </Badge>
                  )}
                </div>

                <div className="mt-1 space-y-1 text-xs">
                  {getReservationsForDay(day).slice(0, 2).map(reservation => (
                    <div 
                      key={reservation.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(reservation);
                      }}
                      className="flex items-center justify-between rounded-sm bg-secondary/80 p-1 hover:bg-secondary"
                    >
                      <div className="truncate">
                        <span className="font-medium">{reservation.time}</span>
                        {" - "}
                        <span>{reservation.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                  
                  {getReservationsForDay(day).length > 2 && (
                    <div className="text-xs text-muted-foreground px-1">
                      + {getReservationsForDay(day).length - 2} plus
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liste des réservations pour le jour sélectionné */}
        <div className="mt-6 border rounded-md p-4">
          <h3 className="font-medium mb-3 capitalize">
            {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
          </h3>
          
          {getReservationsForDay(selectedDay).length > 0 ? (
            <div className="space-y-3">
              {getReservationsForDay(selectedDay).map(reservation => (
                <div 
                  key={reservation.id}
                  className="p-3 border rounded-md hover:bg-accent/10 cursor-pointer transition-colors"
                  onClick={() => handleEdit(reservation)}
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
                          handleEdit(reservation);
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
                          handleDelete(reservation.id);
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
            <div className="text-center py-8 text-muted-foreground">
              Aucune réservation pour cette date
            </div>
          )}
        </div>
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
