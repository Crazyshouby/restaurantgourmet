
import React, { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MenuItem } from "@/types/menu";
import MenuItemDialog from "./MenuItemDialog";
import MenuItemForm from "./MenuItemForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MenuItemCard from "./list/MenuItemCard";
import DeleteConfirmationDialog from "./list/DeleteConfirmationDialog";

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

  const handleDeleteConfirm = (itemId: string) => {
    console.log("Confirming deletion of item:", itemId);
    onDeleteItem(itemId);
    setDeletingItemId(null);
  };

  const handleDeleteClick = (itemId: string) => {
    console.log("Setting deletingItemId to:", itemId);
    setDeletingItemId(itemId);
  };

  const getDeletingItem = () => {
    return items.find(item => item.id === deletingItemId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard 
          key={item.id}
          item={item}
          onEdit={() => setEditingItem(item)}
          onDeleteClick={handleDeleteClick}
        />
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

      {/* Dialog de confirmation de suppression */}
      {items.map(item => (
        <AlertDialog 
          key={`delete-dialog-${item.id}`}
          open={deletingItemId === item.id} 
          onOpenChange={(open) => !open && setDeletingItemId(null)}
        >
          <AlertDialogTrigger className="hidden" />
          {deletingItemId === item.id && (
            <DeleteConfirmationDialog 
              itemName={item.name}
              onConfirm={() => handleDeleteConfirm(deletingItemId)}
            />
          )}
        </AlertDialog>
      ))}
    </div>
  );
};

export default MenuItemsList;
