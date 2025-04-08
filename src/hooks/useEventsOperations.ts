
import { useEventsQuery } from "./events/useEventsQueries";
import { 
  useAddEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation 
} from "./events/useEventsMutations";
import { Event } from "@/types/events";
import { toast } from "sonner";

export const useEventsOperations = () => {
  const { data: events = [], isLoading, error, refetch } = useEventsQuery();
  const addEventMutation = useAddEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();

  const addEvent = (newEvent: Omit<Event, "id">) => {
    return addEventMutation.mutate(newEvent);
  };

  const updateEvent = (event: Event) => {
    return updateEventMutation.mutate(event);
  };

  const deleteEvent = async (eventId: string) => {
    console.log("useEventsOperations - Suppression de l'événement:", eventId);
    
    if (!eventId) {
      toast.error("ID d'événement invalide");
      return Promise.reject(new Error("ID d'événement invalide"));
    }
    
    try {
      // Effectuer la suppression via la mutation
      const result = await deleteEventMutation.mutateAsync(eventId);
      
      // Forcer un rafraîchissement des données
      await refetch();
      
      return result;
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      throw error; // Propager l'erreur pour être gérée par le composant
    }
  };

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refetch,
  };
};
