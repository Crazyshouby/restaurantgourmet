
import React from "react";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8 md:py-12">
        <LoadingSpinner size={isMobile ? "md" : "lg"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-12 text-red-500 px-4">
        <p>Une erreur est survenue lors du chargement du menu.</p>
        <p className="text-sm mt-2">Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 md:py-12 text-muted-foreground px-4">
        Aucun plat trouvé dans cette catégorie.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
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
