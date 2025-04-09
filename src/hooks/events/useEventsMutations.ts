
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
      if (!eventId) {
        throw new Error("ID d'événement invalide");
      }
      
      // Journalisation pour le débogage
      console.log("Tentative de suppression de l'événement:", eventId);
      
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
      // Invalider la requête pour forcer un rechargement des données
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      console.error("Échec de la suppression d'événement:", error);
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

export const useDeleteAllEventsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("Tentative de suppression de tous les événements");
      
      // Modified approach - delete all events without using a condition
      // that was causing the UUID format error
      const { error } = await supabase
        .from("events")
        .delete()
        .is("id", "is not", null);  // This works as a condition that matches all rows

      if (error) {
        console.error("Erreur lors de la suppression de tous les événements:", error);
        throw new Error(error.message);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Tous les événements ont été supprimés avec succès");
    },
    onError: (error) => {
      console.error("Échec de la suppression de tous les événements:", error);
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
