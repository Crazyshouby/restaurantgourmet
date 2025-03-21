
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, Check, Trash2, Edit } from "lucide-react";
import { Reservation } from "@/types";
import { ReservationService } from "@/services/ReservationService";
import { toast } from "sonner";
import ReservationEditModal from "./ReservationEditModal";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Regrouper les réservations par jour
  const reservationsByDay = useMemo(() => {
    const groups: Record<string, Reservation[]> = {};
    
    reservations.forEach(reservation => {
      // Formater la date comme clé pour regrouper (YYYY-MM-DD)
      const dateKey = reservation.date instanceof Date 
        ? reservation.date.toISOString().split('T')[0]
        : new Date(reservation.date).toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(reservation);
    });
    
    // Convertir en tableau pour faciliter le rendu
    return Object.entries(groups).map(([dateStr, items]) => ({
      date: new Date(dateStr),
      items,
    }));
  }, [reservations]);

  const handleDelete = async (id: string) => {
    try {
      const success = await ReservationService.deleteReservation(id);
      
      if (success) {
        toast.success("Réservation supprimée", {
          description: "La réservation a été supprimée avec succès."
        });
        
        if (onReservationDeleted) {
          onReservationDeleted();
        }
      } else {
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer la réservation."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur de suppression", {
        description: "Une erreur est survenue lors de la suppression."
      });
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  const handleReservationUpdated = () => {
    if (onReservationUpdated) {
      onReservationUpdated();
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

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
            <div className="space-y-3">
              {reservationsByDay.map((dayGroup, groupIndex) => (
                <div key={dayGroup.date.toISOString()}>
                  {/* Afficher le séparateur avec la date */}
                  <div className="flex items-center gap-2 py-2">
                    <Separator className="flex-grow" />
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {formatDate(dayGroup.date)}
                    </span>
                    <Separator className="flex-grow" />
                  </div>
                  
                  {/* Liste des réservations du jour */}
                  {dayGroup.items.map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/10 cursor-pointer"
                      onClick={() => handleEdit(reservation)}
                    >
                      <div>
                        <h4 className="font-medium">{reservation.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {reservation.time}
                          {' • '}{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {reservation.email} • {reservation.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reservation.googleEventId && (
                          <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                            <Check className="h-3 w-3" />
                            Synchronisé
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
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
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(reservation.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Aucune réservation pour le moment
            </div>
          )}
        </CardContent>
      </Card>

      <ReservationEditModal
        reservation={selectedReservation}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onReservationUpdated={handleReservationUpdated}
      />
    </>
  );
};

export default ReservationsList;
