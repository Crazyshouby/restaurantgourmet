
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";
import { format, add } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarHeaderProps {
  firstDayCurrentMonth: Date;
  today: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  goToToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  firstDayCurrentMonth,
  today,
  previousMonth,
  nextMonth,
  goToToday
}) => {
  return (
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
            {format(firstDayCurrentMonth, "d MMM", { locale: fr })} - {format(add(firstDayCurrentMonth, { months: 1, days: -1 }), "d MMM", { locale: fr })}
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
  );
};

export default CalendarHeader;
