
import { useMenuQueries } from "./menu/useMenuQueries";
import { useMenuMutations } from "./menu/useMenuMutations";

/**
 * Custom hook to handle all menu-related operations
 */
export const useMenuOperations = () => {
  const { items, isLoading, error } = useMenuQueries();
  const { handleAddItem, handleUpdateItem, handleDeleteItem } = useMenuMutations();

  return {
    items,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem
  };
};
