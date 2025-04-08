
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";
import { toast } from "sonner";

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
    mutationFn: async (eventId: string): Promise<string> => {
      console.log("Mutation - Suppression de l'événement:", eventId);
      
      // Supprimer complètement de Supabase
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        throw new Error(`Erreur de suppression: ${error.message}`);
      }
      
      return eventId;
    },
    onSuccess: (deletedEventId) => {
      console.log("Mutation - Suppression réussie pour ID:", deletedEventId);
      
      // Mettre à jour le cache immédiatement (optimistic update)
      queryClient.setQueryData(["events"], (oldEvents: Event[] | undefined) => {
        if (!oldEvents) return [];
        return oldEvents.filter(event => event.id !== deletedEventId);
      });
      
      // Forcer une invalidation complète du cache pour un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur dans onError:", error);
      toast.error(`Échec de la suppression: ${error.message}`);
    },
  });
};
