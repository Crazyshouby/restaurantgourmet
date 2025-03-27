
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import EventsList from "./EventsList";
import EventForm from "./EventForm";
import EventDialog from "./EventDialog";
import { toast } from "sonner";

interface EventsAdminContainerProps {
  events: Event[];
  isLoading: boolean;
  onAddEvent: (newEvent: Omit<Event, "id">) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsAdminContainer: React.FC<EventsAdminContainerProps> = ({
  events,
  isLoading,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
        </Button>
      </div>

      <EventsList 
        events={events} 
        isLoading={isLoading}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
      />

      <EventDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        title="Ajouter un nouvel événement"
        description="Complétez le formulaire pour ajouter un événement."
      >
        <EventForm 
          onSubmit={(formData) => {
            onAddEvent(formData);
            setIsAddDialogOpen(false);
          }}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </EventDialog>
    </div>
  );
};

export default EventsAdminContainer;
