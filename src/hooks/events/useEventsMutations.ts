
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { toast } from "sonner";
import { GoogleCalendarService } from "@/services/google-calendar";

export const useAddEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Omit<Event, "id">) => {
      const { data, error } = await supabase
        .from("events")
        .insert([newEvent])
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de l'ajout de l'événement:", error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Événement ajouté avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedEvent: Event) => {
      const { id, ...eventData } = updatedEvent;
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour de l'événement:", error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Événement mis à jour avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      // 1. Récupérer les détails de l'événement pour vérifier s'il a un lien Google Calendar
      const { data: event, error: fetchError } = await supabase
        .from("events")
        .select("id, google_event_id")
        .eq("id", eventId)
        .single();

      if (fetchError) {
        console.error("Erreur lors de la récupération de l'événement:", fetchError);
        // Continuer malgré l'erreur, car nous voulons essayer de supprimer l'événement de toute façon
      }

      // 2. Si l'événement a un ID Google Calendar, essayer de le supprimer
      if (event?.google_event_id) {
        try {
          const isConnected = await GoogleCalendarService.isConnected();
          if (isConnected) {
            await GoogleCalendarService.deleteEvent(event.google_event_id);
          }
        } catch (googleError) {
          console.error("Erreur lors de la suppression de l'événement Google Calendar:", googleError);
          // Continuer malgré l'erreur de Google Calendar
        }
      }

      // 3. Supprimer l'événement de la base de données
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Erreur lors de la suppression de l'événement:", error);
        throw new Error(error.message);
      }

      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
