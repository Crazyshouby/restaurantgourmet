
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/menu";

/**
 * Custom hook to handle all menu-related operations
 */
export const useMenuOperations = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

  // Mutation to add a new menu item
  const addItemMutation = useMutation({
    mutationFn: async (newItem: Omit<MenuItem, "id">) => {
      console.log("Tentative d'ajout d'un nouveau plat:", newItem);
      const { data, error } = await supabase
        .from('menu_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) {
        console.error("Erreur lors de l'ajout:", error);
        throw new Error(error.message);
      }
      return data as MenuItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success("Plat ajouté", {
        description: "Le plat a été ajouté au menu."
      });
    },
    onError: (err: Error) => {
      console.error("Erreur d'ajout détaillée:", err);
      toast.error("Erreur", {
        description: `Impossible d'ajouter le plat: ${err.message}`
      });
    }
  });

  // Mutation to update an existing menu item
  const updateItemMutation = useMutation({
    mutationFn: async (updatedItem: MenuItem) => {
      console.log("Tentative de mise à jour du plat:", updatedItem);
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          category: updatedItem.category,
          image: updatedItem.image,
          featured: updatedItem.featured
        })
        .eq('id', updatedItem.id)
        .select()
        .single();
      
      if (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success("Plat modifié", {
        description: "Le plat a été mis à jour."
      });
    },
    onError: (err: Error) => {
      console.error("Erreur de mise à jour détaillée:", err);
      toast.error("Erreur", {
        description: `Impossible de modifier le plat: ${err.message}`
      });
    }
  });

  // Mutation to delete a menu item
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      console.log("Tentative de suppression du plat ID:", itemId);
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        throw new Error(error.message);
      }
      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success("Plat supprimé", {
        description: "Le plat a été supprimé du menu."
      });
    },
    onError: (err: Error) => {
      console.error("Erreur de suppression détaillée:", err);
      toast.error("Erreur", {
        description: `Impossible de supprimer le plat: ${err.message}`
      });
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

  // Handler functions for component use
  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    addItemMutation.mutate(newItem);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    updateItemMutation.mutate(updatedItem);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItemMutation.mutate(itemId);
  };

  return {
    items,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem
  };
};
