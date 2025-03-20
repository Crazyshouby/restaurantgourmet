
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReservationCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
  disabledDates?: Date[];
  className?: string;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  onDateSelect,
  selectedDate,
  disabledDates = [],
  className,
}) => {
  return (
    <Card className={cn("shadow-card overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="p-4 bg-primary text-primary-foreground">
          <h3 className="text-lg font-medium">
            {selectedDate
              ? `Date sélectionnée: ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`
              : "Sélectionnez une date"}
          </h3>
        </div>
        <div className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => {
              // Désactiver les dates passées
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || disabledDates.some(disabledDate => 
                disabledDate.getDate() === date.getDate() &&
                disabledDate.getMonth() === date.getMonth() &&
                disabledDate.getFullYear() === date.getFullYear()
              );
            }}
            locale={fr}
            className="rounded-md pointer-events-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCalendar;
