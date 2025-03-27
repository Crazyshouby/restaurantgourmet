
import React from "react";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface MenuItemGridProps {
  isLoading: boolean;
  error: unknown;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

const MenuItemGrid: React.FC<MenuItemGridProps> = ({ 
  isLoading, 
  error, 
  items, 
  onItemClick 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Une erreur est survenue lors du chargement du menu. Veuillez réessayer plus tard.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun plat trouvé dans cette catégorie.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard 
          key={item.id} 
          item={item} 
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default MenuItemGrid;
