
import { supabase } from "@/integrations/supabase/client";
import { menuItems } from "@/data/menu-items";

/**
 * Cette fonction permet d'importer les éléments du menu depuis les données statiques
 * vers la base de données Supabase. Elle peut être exécutée depuis la console 
 * ou intégrée dans l'interface d'administration.
 */
export const seedMenuItems = async () => {
  try {
    // Vérifier d'abord si la table contient déjà des données
    const { count, error: countError } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Erreur lors de la vérification des données: ${countError.message}`);
    }
    
    // Si la table contient déjà des données, demander confirmation avant de continuer
    if (count && count > 0) {
      console.log(`La table menu_items contient déjà ${count} éléments.`);
      // Dans un contexte d'interface utilisateur, vous pourriez demander une confirmation
      // avant de continuer
    }
    
    // Importer les données
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        featured: item.featured || false
      })));
    
    if (error) {
      throw new Error(`Erreur lors de l'importation des données: ${error.message}`);
    }
    
    console.log(`${menuItems.length} éléments de menu ont été importés avec succès.`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'importation du menu:", error);
    return false;
  }
};
