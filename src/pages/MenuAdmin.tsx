
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MenuAdminContainer from "@/components/admin/menu/MenuAdminContainer";
import AdminHeader from "@/components/admin/AdminHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { useMenuOperations } from "@/hooks/useMenuOperations";

const MenuAdmin = () => {
  const {
    items,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem
  } = useMenuOperations();

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
