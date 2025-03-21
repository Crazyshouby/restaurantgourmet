
import { useState, useCallback } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { Reservation } from "@/types";

export const useCalendarState = (reservations: Reservation[]) => {
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

  const previousMonth = useCallback(() => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  }, [firstDayCurrentMonth]);

  const nextMonth = useCallback(() => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }, [firstDayCurrentMonth]);

  const goToToday = useCallback(() => {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  }, [today]);

  const handleEdit = useCallback((reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  }, []);

  // Récupération des réservations par jour
  const getReservationsForDay = useCallback((day: Date) => {
    return reservations.filter(reservation => {
      const reservationDate = reservation.date instanceof Date 
        ? reservation.date 
        : new Date(reservation.date);
      return (
        reservationDate.getDate() === day.getDate() &&
        reservationDate.getMonth() === day.getMonth() &&
        reservationDate.getFullYear() === day.getFullYear()
      );
    }).sort((a, b) => a.time.localeCompare(b.time));
  }, [reservations]);

  return {
    today,
    selectedDay,
    setSelectedDay,
    currentMonth,
    setCurrentMonth,
    firstDayCurrentMonth,
    days,
    previousMonth,
    nextMonth,
    goToToday,
    selectedReservation,
    setSelectedReservation,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEdit,
    getReservationsForDay
  };
};

export const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
