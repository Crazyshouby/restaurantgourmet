
import React, { useState } from "react";
import { Edit, Trash2, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MenuItem } from "@/types/menu";
import MenuItemDialog from "./MenuItemDialog";
import MenuItemForm from "./MenuItemForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface MenuItemsListProps {
  items: MenuItem[];
  isLoading: boolean;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({
  items,
  isLoading,
  onUpdateItem,
  onDeleteItem
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-muted/20">
        <p className="text-lg text-muted-foreground">Aucun plat trouvé dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-sm transition-shadow">
          <div className="relative h-40 overflow-hidden bg-muted">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.classList.add("p-6");
              }}
            />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
              <span className="text-xs text-white font-medium px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
            {item.featured && (
              <span className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                Spécialité
              </span>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          </CardHeader>
          
          <CardFooter className="flex justify-between p-4 pt-0 items-center">
            <span className="font-medium flex items-center">
              {item.price.toFixed(2)} <Euro className="ml-1 h-4 w-4" />
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditingItem(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog open={deletingItemId === item.id} onOpenChange={() => setDeletingItemId(null)}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeletingItemId(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce plat ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Le plat "{item.name}" sera définitivement supprimé du menu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      onDeleteItem(item.id);
                      setDeletingItemId(null);
                    }}>
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Dialog pour l'édition */}
      <MenuItemDialog 
        isOpen={!!editingItem} 
        onOpenChange={(open) => !open && setEditingItem(null)}
        title="Modifier le plat"
        description="Modifiez les informations du plat."
      >
        {editingItem && (
          <MenuItemForm 
            initialData={editingItem}
            onSubmit={(formData) => {
              onUpdateItem({ ...formData, id: editingItem.id });
              setEditingItem(null);
            }}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </MenuItemDialog>
    </div>
  );
};

export default MenuItemsList;
