
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/events";

export const useEventsQuery = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      console.log("[QUERY] Chargement des événements...");
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("[QUERY] Erreur lors du chargement des événements:", error);
        throw new Error(error.message);
      }

      console.log("[QUERY] Événements chargés:", data?.length || 0);
      return data || [];
    },
    staleTime: 0, // Considérer les données comme immédiatement périmées
    refetchOnMount: "always", // Toujours rafraîchir au montage
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2, // Réessayer 2 fois en cas d'échec
  });
};
