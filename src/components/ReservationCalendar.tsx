import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
interface ReservationCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
  disabledDates?: Date[];
  className?: string;
}

// Fuseau horaire canadien (GMT-4)
const TIMEZONE = "America/New_York";
const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  onDateSelect,
  selectedDate,
  disabledDates = [],
  className
}) => {
  // Convertir la date sélectionnée au fuseau horaire canadien si elle existe
  const zonedSelectedDate = selectedDate ? toZonedTime(selectedDate, TIMEZONE) : undefined;

  // Fonction pour convertir une date au fuseau horaire canadien lors de la sélection
  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date);
  };
  return <Card className={cn("shadow-card overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="text-lg font-medium">
            {selectedDate ? `Date sélectionnée: ${format(zonedSelectedDate as Date, "d MMMM yyyy", {
            locale: fr
          })}` : "Sélectionnez une date"}
          </h3>
        </div>
        <div className="p-3 my-0 py-[8px] mx-0">
          <Calendar mode="single" selected={zonedSelectedDate} onSelect={handleDateSelect} disabled={date => {
          // Désactiver les dates passées
          const today = toZonedTime(new Date(), TIMEZONE);
          today.setHours(0, 0, 0, 0);
          return date < today || disabledDates.some(disabledDate => {
            const zonedDisabledDate = toZonedTime(disabledDate, TIMEZONE);
            return zonedDisabledDate.getDate() === date.getDate() && zonedDisabledDate.getMonth() === date.getMonth() && zonedDisabledDate.getFullYear() === date.getFullYear();
          });
        }} locale={fr} className="rounded-md pointer-events-auto" />
        </div>
      </CardContent>
    </Card>;
};
export default ReservationCalendar;