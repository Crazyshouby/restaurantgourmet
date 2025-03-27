
import React, { useState } from "react";
import Layout from "@/components/home/Layout";
import EventCard from "@/components/events/EventCard";
import EventDetailsDialog from "@/components/events/EventDetailsDialog";
import { useEventsQuery } from "@/hooks/events/useEventsQueries";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Event } from "@/types/events";

const Events = () => {
  const { data: events = [], isLoading, error } = useEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Nos Événements</h1>
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Chargement des événements..." />
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Une erreur est survenue lors du chargement des événements.</p>
          </div>
        )}
        
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
          </div>
        )}
        
        {!isLoading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={handleEventClick}
              />
            ))}
          </div>
        )}

        <EventDetailsDialog 
          event={selectedEvent}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      </div>
    </Layout>
  );
};

export default Events;
