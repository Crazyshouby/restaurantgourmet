
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import EventsList from "./EventsList";
import EventForm from "./EventForm";
import EventDialog from "./EventDialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteConfirmationDialog from "./list/DeleteConfirmationDialog";

interface EventsAdminContainerProps {
  events: Event[];
  isLoading: boolean;
  onAddEvent: (newEvent: Omit<Event, "id">) => void;
  onUpdateEvent: (updatedEvent: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onDeleteAllEvents?: () => void;
}

const EventsAdminContainer: React.FC<EventsAdminContainerProps> = ({
  events,
  isLoading,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDeleteAllEvents
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDeleteAllConfirm = async () => {
    if (!onDeleteAllEvents) return;
    
    try {
      setIsDeletingAll(true);
      onDeleteAllEvents();
      
      // Ajout d'un petit délai avant de fermer le dialogue
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsDeletingAll(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button 
          onClick={() => setIsDeleteAllDialogOpen(true)}
          variant="destructive"
          disabled={events.length === 0 || isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer tous les événements
        </Button>
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

      {/* Dialog de confirmation pour supprimer tous les événements */}
      <AlertDialog 
        open={isDeleteAllDialogOpen} 
        onOpenChange={setIsDeleteAllDialogOpen}
      >
        <AlertDialogTrigger className="hidden" />
        <DeleteConfirmationDialog 
          eventTitle="tous les événements"
          onConfirm={handleDeleteAllConfirm}
          isLoading={isDeletingAll}
        />
      </AlertDialog>
    </div>
  );
};

export default EventsAdminContainer;
