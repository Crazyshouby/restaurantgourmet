
import React from "react";
import { Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/types/events";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDeleteClick: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDeleteClick 
}) => {
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
    <Card key={event.id} className="overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative h-40 overflow-hidden bg-muted">
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
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {event.time}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-0 p-4 items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(event)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log("Attempting to delete event:", event.id);
              onDeleteClick(event.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
