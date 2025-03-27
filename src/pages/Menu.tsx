
import React, { useState } from "react";
import { MenuCategory, MenuItem } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MenuItemDetailsDialog from "@/components/menu/MenuItemDetailsDialog";
import Layout from "@/components/home/Layout";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuCategoryFilter from "@/components/menu/MenuCategoryFilter";
import MenuItemGrid from "@/components/menu/MenuItemGrid";

const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data as MenuItem[];
};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "Tous">("Tous");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: menuItems = [],
    isLoading,
    error 
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });

  const filteredItems = selectedCategory === "Tous" 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCategoryChange = (category: MenuCategory | "Tous") => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <MenuHeader />
          <MenuCategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <MenuItemGrid 
            isLoading={isLoading}
            error={error}
            items={filteredItems}
            onItemClick={handleItemClick}
          />
        </div>
      </div>

      <MenuItemDetailsDialog
        item={selectedItem}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Layout>
  );
};

export default Menu;
