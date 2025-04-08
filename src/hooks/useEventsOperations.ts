
import { useEventsQuery } from "./events/useEventsQueries";
import { 
  useAddEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation 
} from "./events/useEventsMutations";
import { Event } from "@/types/events";

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

  const deleteEvent = (eventId: string) => {
    console.log("useEventsOperations - Appel de deleteEventMutation.mutate avec ID:", eventId);
    return deleteEventMutation.mutate(eventId);
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
