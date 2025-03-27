
import React from "react";
import { MenuCategory } from "@/types/menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface MenuCategoryFilterProps {
  selectedCategory: MenuCategory | "Tous";
  onCategoryChange: (category: MenuCategory | "Tous") => void;
}

const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <ToggleGroup 
      type="single" 
      className="flex flex-wrap justify-center gap-2" 
      value={selectedCategory}
      onValueChange={(value) => {
        if (value) onCategoryChange(value as MenuCategory | "Tous");
      }}
    >
      <ToggleGroupItem value="Tous" className="px-3 py-1 text-sm">
        Tous
      </ToggleGroupItem>
      <ToggleGroupItem value="Entrées" className="px-3 py-1 text-sm">
        Entrées
      </ToggleGroupItem>
      <ToggleGroupItem value="Plats" className="px-3 py-1 text-sm">
        Plats
      </ToggleGroupItem>
      <ToggleGroupItem value="Desserts" className="px-3 py-1 text-sm">
        Desserts
      </ToggleGroupItem>
      <ToggleGroupItem value="Boissons" className="px-3 py-1 text-sm">
        Boissons
      </ToggleGroupItem>
      <ToggleGroupItem value="Apéritifs" className="px-3 py-1 text-sm">
        Apéritifs
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default MenuCategoryFilter;
