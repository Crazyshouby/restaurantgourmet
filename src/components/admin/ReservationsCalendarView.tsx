
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CalendarRange } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isEqual, isSameDay } from "date-fns";
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

const ReservationsCalendarView: React.FC<ReservationsCalendarViewProps> = ({
  reservations,
  onReservationUpdated,
  onReservationDeleted
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fonction pour obtenir toutes les dates avec des réservations
  const getDaysWithReservations = () => {
    return reservations.map(reservation => {
      // S'assurer que la date est un objet Date
      return reservation.date instanceof Date 
        ? reservation.date
        : new Date(reservation.date);
    });
  };

  // Filtrer les réservations pour la date sélectionnée
  const reservationsForSelectedDate = selectedDate 
    ? reservations.filter(reservation => {
        const reservationDate = reservation.date instanceof Date 
          ? reservation.date 
          : new Date(reservation.date);
        
        return isSameDay(reservationDate, selectedDate);
      })
    : [];

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
  
  // Décoration pour le calendrier - montrer le nombre de réservations par jour
  const decorationFunction = (date: Date) => {
    const reservationsOnDay = reservations.filter(reservation => {
      const reservationDate = reservation.date instanceof Date 
        ? reservation.date 
        : new Date(reservation.date);
      return isSameDay(reservationDate, date);
    });
    
    if (reservationsOnDay.length > 0) {
      return (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <Badge 
            variant="secondary" 
            className="text-xs h-4 px-1 rounded-sm"
          >
            {reservationsOnDay.length}
          </Badge>
        </div>
      );
    }
    return null;
  };

  // Fonction pour formater la date en français
  const formatDateFr = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendrier à gauche */}
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-2 pointer-events-auto"
              locale={fr}
              components={{
                DayContent: ({ date, ...props }) => (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div {...props} />
                    {decorationFunction(date)}
                  </div>
                ),
              }}
            />
          </div>
          
          {/* Liste des réservations pour la date sélectionnée à droite */}
          <div className="lg:col-span-1 border rounded-md p-4">
            <h3 className="font-medium mb-3 capitalize">
              {selectedDate ? formatDateFr(selectedDate) : "Sélectionnez une date"}
            </h3>
            
            {reservationsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {reservationsForSelectedDate
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(reservation => (
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
