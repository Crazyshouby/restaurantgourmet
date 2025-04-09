
import React, { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Event } from "@/types/events";
import EventDialog from "../events/EventDialog";
import EventForm from "../events/EventForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EventCard from "../events/list/EventCard";
import DeleteConfirmationDialog from "../events/list/DeleteConfirmationDialog";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-muted/20">
        <p className="text-lg text-muted-foreground">Aucun événement trouvé</p>
      </div>
    );
  }

  const handleDeleteConfirm = async (eventId: string) => {
    try {
      setIsDeletingEvent(true);
      console.log("Confirmation de suppression de l'événement:", eventId);
      onDeleteEvent(eventId);
      
      // Ajout d'un petit délai avant de fermer le dialogue
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsDeletingEvent(false);
      setDeletingEventId(null);
    }
  };

  const handleDeleteClick = (eventId: string) => {
    console.log("Configuration de deletingEventId à:", eventId);
    setDeletingEventId(eventId);
  };

  // Filtrer les événements en cours de suppression de l'affichage
  const displayEvents = isDeletingEvent && deletingEventId 
    ? events.filter(e => e.id !== deletingEventId) 
    : events;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayEvents.map((event) => (
        <EventCard 
          key={event.id}
          event={event}
          onEdit={() => setEditingEvent(event)}
          onDeleteClick={handleDeleteClick}
        />
      ))}

      {/* Dialog pour l'édition */}
      <EventDialog 
        isOpen={!!editingEvent} 
        onOpenChange={(open) => !open && setEditingEvent(null)}
        title="Modifier l'événement"
        description="Modifiez les informations de l'événement."
      >
        {editingEvent && (
          <EventForm 
            initialData={editingEvent}
            onSubmit={(formData) => {
              onUpdateEvent({ ...formData, id: editingEvent.id });
              setEditingEvent(null);
            }}
            onCancel={() => setEditingEvent(null)}
          />
        )}
      </EventDialog>

      {/* Dialog de confirmation de suppression */}
      {events.map(event => (
        <AlertDialog 
          key={`delete-dialog-${event.id}`}
          open={deletingEventId === event.id} 
          onOpenChange={(open) => !open && setDeletingEventId(null)}
        >
          <AlertDialogTrigger className="hidden" />
          {deletingEventId === event.id && (
            <DeleteConfirmationDialog 
              eventTitle={event.title}
              onConfirm={() => handleDeleteConfirm(deletingEventId)}
              isLoading={isDeletingEvent}
            />
          )}
        </AlertDialog>
      ))}
    </div>
  );
};

export default EventsList;
