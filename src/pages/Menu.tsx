
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MenuCategory, MenuItem } from "@/types/menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Euro } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import MenuItemDetailsDialog from "@/components/menu/MenuItemDetailsDialog";
import Layout from "@/components/home/Layout";

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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Gastronomie française
            </span>
            <h2 className="text-3xl font-medium mt-3 mb-4">Notre carte</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos créations culinaires élaborées avec des produits frais et de saison.
              Notre chef s'inspire des traditions françaises tout en y apportant une touche de modernité.
            </p>
          </div>

          <div className="mb-10">
            <ToggleGroup 
              type="single" 
              className="flex flex-wrap justify-center gap-2 md:gap-4" 
              defaultValue="Tous"
              value={selectedCategory}
              onValueChange={(value) => {
                if (value) setSelectedCategory(value as MenuCategory | "Tous");
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

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Une erreur est survenue lors du chargement du menu. Veuillez réessayer plus tard.
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun plat trouvé dans cette catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.classList.add("p-6");
                      }}
                    />
                    {item.featured && (
                      <span className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                        Spécialité
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="text-xs text-white font-medium px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                    <CardDescription className="h-20 overflow-hidden">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0 items-center">
                    <span className="font-medium text-primary flex items-center">
                      {parseFloat(item.price.toString()).toFixed(2)} <Euro className="ml-1 h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
