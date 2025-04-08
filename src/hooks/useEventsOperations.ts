
import { useEventsQuery } from "./events/useEventsQueries";
import { 
  useAddEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation 
} from "./events/useEventsMutations";
import { Event } from "@/types/events";
import { toast } from "sonner";

export const useEventsOperations = () => {
  const { data: events = [], isLoading, error } = useEventsQuery();
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
    console.log("useEventsOperations - Début de suppression pour l'événement ID:", eventId);
    
    if (!eventId) {
      console.error("Erreur: ID d'événement invalide");
      toast.error("Impossible de supprimer l'événement: ID invalide");
      return Promise.reject(new Error("ID d'événement invalide"));
    }
    
    try {
      // Utilisation directe de la mutation asynchrone et retour de la promesse
      const result = await deleteEventMutation.mutateAsync(eventId);
      console.log("useEventsOperations - Suppression réussie, résultat:", result);
      return result;
    } catch (error: any) {
      console.error("useEventsOperations - Erreur lors de la suppression:", error);
      toast.error(`Erreur lors de la suppression: ${error.message || "Erreur inconnue"}`);
      throw error; // Propagation de l'erreur pour traitement ultérieur
    }
  };

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
