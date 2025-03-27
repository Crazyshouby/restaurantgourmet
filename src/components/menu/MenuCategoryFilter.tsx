
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MenuCategory } from "@/types/menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuCategoryFilterProps {
  selectedCategory: MenuCategory | "Tous";
  onCategoryChange: (value: MenuCategory | "Tous") => void;
}

const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const isMobile = useIsMobile();
  const categories: (MenuCategory | "Tous")[] = [
    "Tous", "Entrées", "Plats", "Desserts", "Boissons", "Apéritifs"
  ];

  return (
    <div className="mb-6 md:mb-10 px-2 md:px-0">
      <ToggleGroup 
        type="single" 
        className={`flex flex-wrap justify-center gap-1 md:gap-4 ${isMobile ? 'overflow-x-auto pb-2 -mx-2 px-2 snap-x' : ''}`}
        value={selectedCategory}
        onValueChange={(value) => {
          if (value) onCategoryChange(value as MenuCategory | "Tous");
        }}
      >
        {categories.map((category) => (
          <ToggleGroupItem 
            key={category}
            value={category} 
            className={`rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base ${isMobile ? 'snap-start min-w-[90px] text-center' : ''}`}
          >
            {category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default MenuCategoryFilter;
