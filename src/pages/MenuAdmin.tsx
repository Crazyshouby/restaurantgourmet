
import React from "react";
import MenuAdminContainer from "@/components/admin/menu/MenuAdminContainer";
import AdminHeader from "@/components/admin/AdminHeader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { useMenuOperations } from "@/hooks/useMenuOperations";
import MenuAdminHeader from "@/components/admin/menu/MenuAdminHeader";
import { AdminThemeProvider } from "@/context/AdminThemeContext";

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
    <AdminThemeProvider>
      <div id="admin-container" className="min-h-screen bg-background">
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
              <MenuAdminHeader 
                title="Gestion du Menu"
                description="Ajoutez, modifiez ou supprimez des plats de votre menu."
              />
              
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
    </AdminThemeProvider>
  );
};

export default MenuAdmin;
