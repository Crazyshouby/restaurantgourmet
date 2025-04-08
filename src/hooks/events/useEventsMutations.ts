
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
      
      // Mise à jour immédiate du cache - on retire l'événement de façon optimiste
      queryClient.setQueryData<Event[]>(["events"], (oldEvents = []) => 
        oldEvents.filter(event => event.id !== eventId)
      );
      
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) {
        console.error("Erreur lors de la suppression de l'événement:", error);
        
        // En cas d'erreur, on récupère les données actuelles depuis le serveur
        queryClient.invalidateQueries({ queryKey: ["events"] });
        
        throw new Error(error.message);
      }

      console.log("Événement supprimé avec succès:", eventId);
      return eventId;
    },
    onSuccess: () => {
      // On n'invalide pas la requête, car on a déjà mis à jour le cache de façon optimiste
      // et la suppression a réussi. On garde donc notre état optimisé.
      toast.success("Événement supprimé avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};
