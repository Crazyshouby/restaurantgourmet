
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";

export const useEventsQuery = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des événements:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
    refetchOnMount: true, // Force le rafraîchissement lors du montage
    refetchOnWindowFocus: true, // Force le rafraîchissement lors de la reprise de focus
  });
};
