
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MenuCategory } from "@/types/menu";

interface MenuCategoryFilterProps {
  selectedCategory: MenuCategory | "Tous";
  onCategoryChange: (value: MenuCategory | "Tous") => void;
}

const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-10">
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap justify-center gap-2 md:gap-4" 
        defaultValue="Tous"
        value={selectedCategory}
        onValueChange={(value) => {
          if (value) onCategoryChange(value as MenuCategory | "Tous");
        }}
      >
        <ToggleGroupItem value="Tous" className="rounded-full px-4 py-2 text-sm">
          Tous
        </ToggleGroupItem>
        <ToggleGroupItem value="Entrées" className="rounded-full px-4 py-2 text-sm">
          Entrées
        </ToggleGroupItem>
        <ToggleGroupItem value="Plats" className="rounded-full px-4 py-2 text-sm">
          Plats
        </ToggleGroupItem>
        <ToggleGroupItem value="Desserts" className="rounded-full px-4 py-2 text-sm">
          Desserts
        </ToggleGroupItem>
        <ToggleGroupItem value="Boissons" className="rounded-full px-4 py-2 text-sm">
          Boissons
        </ToggleGroupItem>
        <ToggleGroupItem value="Apéritifs" className="rounded-full px-4 py-2 text-sm">
          Apéritifs
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default MenuCategoryFilter;
