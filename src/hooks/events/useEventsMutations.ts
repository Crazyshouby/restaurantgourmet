
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
      console.log("Mutation - Début de suppression avec ID:", eventId);
      
      if (!eventId) {
        throw new Error("ID d'événement manquant");
      }
      
      // Exécution directe de la requête Supabase
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Erreur Supabase lors de la suppression:", error);
        throw new Error(error.message);
      }
      
      console.log("Mutation - Suppression réussie dans Supabase pour ID:", eventId);
      return eventId;
    },
    onSuccess: (deletedEventId) => {
      console.log("Mutation - onSuccess avec ID:", deletedEventId);
      
      // Force complète du rafraîchissement des données
      queryClient.removeQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      toast.success("Événement supprimé avec succès");
    },
    onError: (error: Error) => {
      console.error("Mutation - Erreur dans onError:", error);
      toast.error(`Erreur de suppression: ${error.message}`);
    },
  });
};
