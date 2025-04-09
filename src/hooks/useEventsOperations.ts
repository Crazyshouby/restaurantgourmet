
import { useEventsQuery } from "./events/useEventsQueries";
import { 
  useAddEventMutation, 
  useUpdateEventMutation, 
  useDeleteEventMutation,
  useDeleteAllEventsMutation
} from "./events/useEventsMutations";
import { Event } from "@/types/events";

export const useEventsOperations = () => {
  const { data: events = [], isLoading, error } = useEventsQuery();
  const addEventMutation = useAddEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const deleteAllEventsMutation = useDeleteAllEventsMutation();

  const addEvent = (newEvent: Omit<Event, "id">) => {
    return addEventMutation.mutate(newEvent);
  };

  const updateEvent = (event: Event) => {
    return updateEventMutation.mutate(event);
  };

  const deleteEvent = (eventId: string) => {
    return deleteEventMutation.mutate(eventId);
  };
  
  const deleteAllEvents = () => {
    return deleteAllEventsMutation.mutate();
  };

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteAllEvents,
  };
};
