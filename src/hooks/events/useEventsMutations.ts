
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
      console.log("[MUTATION] Début suppression événement ID:", eventId);
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("[MUTATION] Erreur lors de la suppression:", error);
        throw new Error(`Erreur de suppression: ${error.message}`);
      }
      
      console.log("[MUTATION] Suppression réussie de l'événement ID:", eventId);
      return eventId;
    },
    onMutate: async (eventId) => {
      // Annuler les requêtes en cours pour éviter les collisions
      await queryClient.cancelQueries({ queryKey: ["events"] });
      
      // Sauvegarder les données précédentes pour les restaurer en cas d'erreur
      const previousEvents = queryClient.getQueryData<Event[]>(["events"]);
      
      // Mettre à jour le cache de manière optimiste
      queryClient.setQueryData<Event[]>(["events"], (old = []) => {
        return old.filter(event => event.id !== eventId);
      });
      
      return { previousEvents };
    },
    onSuccess: (deletedEventId, _, context) => {
      console.log("[MUTATION] onSuccess pour l'événement ID:", deletedEventId);
      
      // Forcer une invalidation et un refetch complet
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Événement supprimé avec succès");
    },
    onError: (error, eventId, context) => {
      console.error("[MUTATION] onError:", error);
      toast.error(`Échec de la suppression: ${error.message}`);
      
      // Restaurer l'état précédent si nous avons une sauvegarde
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents);
      }
    },
    onSettled: () => {
      // Toujours refetch pour être sûr
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
};
