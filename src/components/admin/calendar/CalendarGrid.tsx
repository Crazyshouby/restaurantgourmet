
import React from "react";
import { isSameDay, isSameMonth, isToday, isEqual, format, getDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Reservation } from "@/types";

interface CalendarGridProps {
  days: Date[];
  firstDayCurrentMonth: Date;
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
  colStartClasses: string[];
  getReservationsForDay: (day: Date) => Reservation[];
  onReservationSelect: (reservation: Reservation) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  firstDayCurrentMonth,
  selectedDay,
  setSelectedDay,
  colStartClasses,
  getReservationsForDay,
  onReservationSelect
}) => {
  return (
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
                    onReservationSelect(reservation);
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
  );
};

export default CalendarGrid;
