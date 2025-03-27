
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
      <DialogContent className={`${isMobile ? 'w-[calc(100%-24px)] p-4' : 'sm:max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className={isMobile ? 'space-y-1 mb-2' : ''}>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>{event.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center text-sm text-muted-foreground mb-2">
            <span className="flex items-center mr-3 mb-1">
              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {event.time}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className={`relative ${isMobile ? 'h-48' : 'h-56'} overflow-hidden bg-muted rounded-md mb-4`}>
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.classList.add("p-6");
            }}
          />
        </div>
        
        <div className={`${isMobile ? 'text-sm' : ''} text-muted-foreground`}>
          <p className="whitespace-pre-line">{event.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
