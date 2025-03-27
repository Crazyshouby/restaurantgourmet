
import React, { useState } from "react";
import { Plus, DatabaseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenuItem, MenuCategory } from "@/types/menu";
import MenuItemsList from "./MenuItemsList";
import MenuItemForm from "./MenuItemForm";
import MenuItemDialog from "./MenuItemDialog";
import MenuCategoryFilter from "./MenuCategoryFilter";
import { seedMenuItems } from "@/scripts/seed-menu-items";
import { toast } from "sonner";

interface MenuAdminContainerProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  onAddItem: (newItem: Omit<MenuItem, "id">) => void;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const MenuAdminContainer: React.FC<MenuAdminContainerProps> = ({
  menuItems,
  isLoading,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "Tous">("Tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const filteredItems = selectedCategory === "Tous" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (category: MenuCategory | "Tous") => {
    setSelectedCategory(category);
  };

  const handleSeedMenuItems = async () => {
    if (menuItems.length > 0) {
      if (!confirm("Des plats existent déjà dans la base de données. Voulez-vous ajouter les plats par défaut ?")) {
        return;
      }
    }
    
    setIsSeeding(true);
    try {
      const success = await seedMenuItems();
      if (success) {
        toast.success("Importation réussie", {
          description: "Les plats par défaut ont été ajoutés au menu."
        });
      } else {
        toast.error("Erreur d'importation", {
          description: "L'importation des plats par défaut a échoué."
        });
      }
    } catch (error) {
      toast.error("Erreur", {
        description: `Une erreur s'est produite: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle>Catégories</CardTitle>
            <CardDescription>Filtrer les plats par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <MenuCategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </CardContent>
        </Card>

        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            onClick={handleSeedMenuItems} 
            disabled={isSeeding}
            className="flex items-center"
          >
            <DatabaseIcon className="mr-2 h-4 w-4" /> 
            {isSeeding ? "Importation..." : "Importer les plats par défaut"}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un plat
          </Button>
        </div>
      </div>

      <MenuItemsList 
        items={filteredItems} 
        isLoading={isLoading}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />

      <MenuItemDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        title="Ajouter un nouveau plat"
        description="Complétez le formulaire pour ajouter un plat au menu."
      >
        <MenuItemForm 
          onSubmit={(formData) => {
            onAddItem(formData);
            setIsAddDialogOpen(false);
          }}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </MenuItemDialog>
    </div>
  );
};

export default MenuAdminContainer;
