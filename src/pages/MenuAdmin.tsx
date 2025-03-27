
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MenuAdminContainer from "@/components/admin/menu/MenuAdminContainer";
import AdminHeader from "@/components/admin/AdminHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { useLoadingState } from "@/hooks/useLoadingState";
import { menuItems } from "@/data/menu-items";
import { MenuItem } from "@/types/menu";

const MenuAdmin = () => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [error, setError] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading, withLoading } = useLoadingState();

  const loadMenuItems = async () => {
    // Cette fonction pourrait être remplacée par un appel API à Supabase
    // pour l'instant, on utilise les données statiques
    setItems(menuItems);
  };

  useEffect(() => {
    const loadData = async () => {
      await withLoading(async () => {
        try {
          await loadMenuItems();
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          toast.error("Erreur de chargement", {
            description: "Impossible de charger les données du menu."
          });
          setError("Impossible de charger les données du menu. Veuillez réessayer.");
        }
      });
    };
    
    loadData();
  }, []);

  const handleAddItem = (newItem: MenuItem) => {
    setItems([...items, newItem]);
    toast.success("Plat ajouté", {
      description: `${newItem.name} a été ajouté au menu.`
    });
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    toast.success("Plat modifié", {
      description: `${updatedItem.name} a été mis à jour.`
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success("Plat supprimé", {
      description: "Le plat a été supprimé du menu."
    });
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
              isLoading={isLoading}
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
