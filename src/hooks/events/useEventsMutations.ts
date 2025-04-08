
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
        .select();

      if (error) {
        console.error("Erreur lors de la mise à jour de l'événement:", error);
        throw new Error(error.message);
      }
      
      // Si aucune donnée n'est retournée, nous renvoyons l'événement mis à jour
      // pour éviter des erreurs côté client
      return data && data.length > 0 ? data[0] : updatedEvent;
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
      console.log("Suppression de l'événement avec ID:", eventId);
      
      // Optimistic update - on sauvegarde les événements actuels
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]) || [];
      
      // Mise à jour optimiste du cache (on retire l'événement)
      queryClient.setQueryData<Event[]>(["events"], old => 
        old ? old.filter(event => event.id !== eventId) : []
      );
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        // En cas d'erreur, on remet les événements précédents
        queryClient.setQueryData(["events"], previousEvents);
        console.error("Erreur lors de la suppression de l'événement:", error);
        throw new Error(error.message);
      }

      console.log("Événement supprimé avec succès:", eventId);
      return eventId;
    },
    onSuccess: (eventId) => {
      // Un petit délai avant d'invalider la requête pour laisser le temps à l'UI de s'actualiser
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["events"] });
      }, 300);
      
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
