
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/menu";
import { toast } from "sonner";

/**
 * Hook pour gérer les requêtes de menu
 */
export const useMenuQueries = () => {
  const [error, setError] = useState<string | null>(null);

  // Query to fetch all menu items
  const { 
    data: items = [], 
    isLoading,
    isError
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems,
    meta: {
      onError: (err: Error) => {
        console.error("Erreur lors du chargement des données:", err);
        toast.error("Erreur de chargement", {
          description: "Impossible de charger les données du menu."
        });
        setError("Impossible de charger les données du menu. Veuillez réessayer.");
      }
    }
  });

  // Function to fetch all menu items
  async function fetchMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    
    return data as MenuItem[];
  }

  return {
    items,
    isLoading,
    error
  };
};
