
import { useEventsQuery } from "./events/useEventsQueries";
import { 
  useAddEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation 
} from "./events/useEventsMutations";
import { Event } from "@/types/events";
import { toast } from "sonner";
import { useLoadingState } from "./useLoadingState";

export const useEventsOperations = () => {
  const { isLoading: isQueryLoading, data: events = [], error, refetch } = useEventsQuery();
  const addEventMutation = useAddEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const { isLoading: isDeleting, startLoading, stopLoading } = useLoadingState();

  const addEvent = (newEvent: Omit<Event, "id">) => {
    return addEventMutation.mutate(newEvent);
  };

  const updateEvent = (event: Event) => {
    return updateEventMutation.mutate(event);
  };

  const deleteEvent = async (eventId: string) => {
    console.log("[OPERATIONS] Suppression de l'événement:", eventId);
    
    if (!eventId) {
      toast.error("ID d'événement invalide");
      return Promise.reject(new Error("ID d'événement invalide"));
    }
    
    try {
      startLoading();
      // Exécuter la suppression
      await deleteEventMutation.mutateAsync(eventId);
      console.log("[OPERATIONS] Suppression réussie, forçage du rafraîchissement");
      
      // Forcer un rafraîchissement des données après un court délai
      await new Promise(resolve => setTimeout(resolve, 300));
      await refetch();
      
      return eventId;
    } catch (error: any) {
      console.error("[OPERATIONS] Erreur lors de la suppression:", error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  const isLoading = isQueryLoading || isDeleting || addEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending;

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
