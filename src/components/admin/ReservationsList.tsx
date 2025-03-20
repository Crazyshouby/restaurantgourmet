
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Check, RefreshCw } from "lucide-react";
import { Reservation } from "@/types";

interface ReservationsListProps {
  reservations: Reservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
  return (
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
        {reservations.length > 0 ? (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div 
                key={reservation.id} 
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div>
                  <h4 className="font-medium">{reservation.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {new Date(reservation.date).toLocaleDateString()} à {reservation.time}
                    {' • '}{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {reservation.email} • {reservation.phone}
                  </div>
                </div>
                <div>
                  {reservation.googleEventId ? (
                    <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                      <Check className="h-3 w-3" />
                      Synchronisé
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
                      <RefreshCw className="h-3 w-3" />
                      En attente
                    </Badge>
                  )}
                </div>
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
  );
};

export default ReservationsList;
