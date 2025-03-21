
import { useMemo } from "react";
import { Reservation } from "@/types";

export function useReservationsByDay(reservations: Reservation[]) {
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
      // Ajuster la date pour éviter le décalage de fuseau horaire
      date: new Date(`${dateStr}T12:00:00`), // Utiliser midi pour éviter tout problème de décalage
      items,
    }));
  }, [reservations]);

  return reservationsByDay;
}
