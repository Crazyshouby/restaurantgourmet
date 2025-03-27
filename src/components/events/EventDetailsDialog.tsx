
import React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Event } from "@/types/events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!event) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de format de date:", error);
      return dateStr;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="flex items-center text-sm text-muted-foreground mb-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(event.date)}
            <Clock className="ml-4 mr-2 h-4 w-4" />
            {event.time}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative h-56 overflow-hidden bg-muted rounded-md mb-4">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.classList.add("p-6");
            }}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="whitespace-pre-line">{event.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
