
import { supabase } from "@/integrations/supabase/client";
import { menuItems } from "@/data/menu-items";
import { v4 as uuidv4 } from 'uuid';

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
    
    console.log(`La table menu_items contient actuellement ${count || 0} éléments.`);
    
    // Préparer les données avec des UUIDs valides
    const preparedMenuItems = menuItems.map(item => ({
      id: uuidv4(), // Générer un UUID compatible avec Supabase
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      featured: item.featured || false
    }));
    
    console.log(`Tentative d'importation de ${preparedMenuItems.length} plats...`);
    
    // Importer les données
    const { data, error } = await supabase
      .from('menu_items')
      .insert(preparedMenuItems);
    
    if (error) {
      console.error("Erreur détaillée:", error);
      throw new Error(`Erreur lors de l'importation des données: ${error.message}`);
    }
    
    console.log(`${preparedMenuItems.length} éléments de menu ont été importés avec succès.`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'importation du menu:", error);
    return false;
  }
};
