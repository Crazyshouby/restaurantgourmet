
import React, { useState, useCallback } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Event } from "@/types/events";
import EventDialog from "./EventDialog";
import EventForm from "./EventForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EventCard from "./list/EventCard";
import DeleteConfirmationDialog from "./list/DeleteConfirmationDialog";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => Promise<any>;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleDeleteClick = useCallback((eventId: string) => {
    console.log("EventCard - Clic sur supprimer pour l'événement:", eventId);
    setDeletingEventId(eventId);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingEventId || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      console.log("[LIST] Confirmation de suppression pour l'événement:", deletingEventId);
      console.log("[LIST] Début de la suppression avec ID:", deletingEventId);
      
      await onDeleteEvent(deletingEventId);
      
      console.log("[LIST] Suppression réussie");
    } catch (error) {
      console.error("[LIST] Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
      // Ne pas fermer la boîte de dialogue ici, laisser le composant DeleteConfirmationDialog s'en charger
    }
  };

  const handleDeleteDialogClose = useCallback(() => {
    console.log("[LIST] Fermeture de la boîte de dialogue de suppression");
    setDeletingEventId(null);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
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
      <AlertDialog 
        open={!!deletingEventId} 
        onOpenChange={(open) => {
          if (!open && !isDeleting) handleDeleteDialogClose();
        }}
      >
        <AlertDialogTrigger className="hidden" />
        {deletingEventId && (
          <DeleteConfirmationDialog 
            eventTitle={events.find(e => e.id === deletingEventId)?.title || ""}
            onConfirm={handleDeleteConfirm}
            onClose={handleDeleteDialogClose}
          />
        )}
      </AlertDialog>
    </div>
  );
};

export default EventsList;
