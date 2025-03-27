
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
  const categories: (MenuCategory | "Tous")[] = [
    "Tous", "Entrées", "Plats", "Desserts", "Boissons", "Apéritifs"
  ];

  return (
    <div className="mb-10">
      <ToggleGroup 
        type="single" 
        className="flex flex-wrap justify-center gap-2 md:gap-4" 
        value={selectedCategory}
        onValueChange={(value) => {
          if (value) onCategoryChange(value as MenuCategory | "Tous");
        }}
      >
        {categories.map((category) => (
          <ToggleGroupItem 
            key={category}
            value={category} 
            className="rounded-full px-4 py-2 text-sm"
          >
            {category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default MenuCategoryFilter;
