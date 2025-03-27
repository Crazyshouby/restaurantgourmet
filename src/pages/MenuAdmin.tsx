
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MenuAdminContainer from "@/components/admin/menu/MenuAdminContainer";
import AdminHeader from "@/components/admin/AdminHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { useLoadingState } from "@/hooks/useLoadingState";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data as MenuItem[];
};

const MenuAdmin = () => {
  const [error, setError] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoadingState();
  const queryClient = useQueryClient();

  // Utiliser React Query pour récupérer les données
  const { 
    data: items = [], 
    isLoading: isLoadingQuery,
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

  // Mutation pour ajouter un nouvel élément
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

  // Mutation pour mettre à jour un élément
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

  // Mutation pour supprimer un élément
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

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    addItemMutation.mutate(newItem);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    updateItemMutation.mutate(updatedItem);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItemMutation.mutate(itemId);
  };

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <AdminHeader />
        {error && (
          <div className="container mx-auto py-4 px-4">
            <ApiErrorAlert 
              title="Erreur de chargement" 
              description={error}
            />
          </div>
        )}
        <main className="container mx-auto py-6 px-4 animate-fade-in">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-medium">Gestion du Menu</h2>
                <p className="text-muted-foreground text-sm">
                  Ajoutez, modifiez ou supprimez des plats de votre menu.
                </p>
              </div>
              <div className="space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin">Retour</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/menu" target="_blank">Voir le menu</Link>
                </Button>
              </div>
            </div>
            
            <MenuAdminContainer 
              menuItems={items}
              isLoading={isLoadingQuery}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default MenuAdmin;
