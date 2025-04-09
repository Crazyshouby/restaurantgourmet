
import React, { useEffect } from "react";
import { useEventsOperations } from "@/hooks/useEventsOperations";
import AdminHeader from "@/components/admin/AdminHeader";
import EventsAdminHeader from "@/components/admin/events/EventsAdminHeader";
import EventsAdminContainer from "@/components/admin/events/EventsAdminContainer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { toast } from "sonner";

const EventsAdmin = () => {
  const { events, isLoading, error, addEvent, updateEvent, deleteEvent, deleteAllEvents } = useEventsOperations();
  
  // Effect to delete all events when the component loads
  useEffect(() => {
    // Delete all events from the database
    console.log("Lancement de la suppression de tous les événements");
    deleteAllEvents();
    toast.success("Suppression de tous les événements en cours...");
  }, [deleteAllEvents]);
  
  // Convert error to string if it exists
  const errorMessage = error ? error.message || "Une erreur s'est produite" : "";
  
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <AdminHeader />
        {error && (
          <div className="container mx-auto py-4 px-4">
            <ApiErrorAlert 
              title="Erreur de chargement" 
              description={errorMessage}
            />
          </div>
        )}
        <main className="container mx-auto py-6 px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto space-y-6">
            <EventsAdminHeader 
              title="Gestion des Événements" 
              description="Ajoutez, modifiez ou supprimez des événements."
            />
            
            <EventsAdminContainer
              events={events}
              isLoading={isLoading}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
              onDeleteAllEvents={deleteAllEvents}
            />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default EventsAdmin;
