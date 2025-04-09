
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
    mutationFn: async (eventId: string) => {
      // Log pour débuggage
      console.log("Tentative de suppression de l'événement avec ID:", eventId);
      
      // Vérifie que l'ID est valide
      if (!eventId) {
        throw new Error("ID d'événement invalide");
      }
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Erreur lors de la suppression de l'événement:", error);
        throw new Error(error.message);
      }
      
      console.log("Événement supprimé avec succès dans la base de données:", eventId);
      return eventId;
    },
    onSuccess: (deletedEventId) => {
      console.log("Mutation de suppression réussie, invalidation de la requête events");
      
      // Au lieu d'une mise à jour optimiste, invalidons correctement la requête
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      console.error("Échec de la suppression d'événement:", error);
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
