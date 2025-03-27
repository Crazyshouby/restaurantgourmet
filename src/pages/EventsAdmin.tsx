
import React from "react";
import { useEventsOperations } from "@/hooks/useEventsOperations";
import AdminHeader from "@/components/admin/AdminHeader";
import EventsAdminHeader from "@/components/admin/events/EventsAdminHeader";
import EventsAdminContainer from "@/components/admin/events/EventsAdminContainer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";

const EventsAdmin = () => {
  const { events, isLoading, error, addEvent, updateEvent, deleteEvent } = useEventsOperations();
  
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <AdminHeader />
        {error && (
          <div className="container mx-auto py-4 px-4">
            <ApiErrorAlert 
              title="Erreur de chargement" 
              description={error}
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
            />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default EventsAdmin;
