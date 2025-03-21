
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Edit } from "lucide-react";
import { Reservation } from "@/types";

interface ReservationItemProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onEdit,
  onDelete
}) => {
  const formatContactInfo = (email: string, phone: string) => {
    const displayEmail = email === 'sans information' || email === 'noemail@example.com' ? 'sans information' : email;
    const displayPhone = phone === 'sans information' || phone === '0000000000' ? 'sans information' : phone;
    
    if (displayEmail === 'sans information' && displayPhone === 'sans information') {
      return 'Aucune information de contact';
    }
    
    return `${displayEmail} • ${displayPhone}`;
  };

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/10 cursor-pointer transition-colors"
      onClick={() => onEdit(reservation)}
      aria-label={`Réservation de ${reservation.name}`}
      role="button"
    >
      <div>
        <h4 className="font-medium">{reservation.name}</h4>
        <div className="text-sm text-muted-foreground">
          {reservation.time}
          {' • '}{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatContactInfo(reservation.email, reservation.phone)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {reservation.googleEventId && (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
            <Check className="h-3 w-3" />
            <span className="sr-only">Synchronisé avec</span>
            Synchronisé
          </Badge>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(reservation);
          }}
          aria-label="Modifier la réservation"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(reservation.id);
          }}
          aria-label="Supprimer la réservation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReservationItem;
