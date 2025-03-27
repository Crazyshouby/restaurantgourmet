
import { z } from "zod";
import { MenuItem, MenuCategory } from "@/types/menu";

export const menuItemFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  price: z.coerce.number().positive({ message: "Le prix doit être positif" }),
  category: z.enum(["Entrées", "Plats", "Desserts", "Boissons", "Apéritifs"]),
  image: z.string().url({ message: "L'image doit être une URL valide" }),
  featured: z.boolean().default(false),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export const CATEGORIES: MenuCategory[] = ["Entrées", "Plats", "Desserts", "Boissons", "Apéritifs"];

export const createMenuItemFromFormValues = (values: MenuItemFormValues): Omit<MenuItem, "id"> => {
  return {
    name: values.name,
    description: values.description,
    price: values.price,
    category: values.category,
    image: values.image,
    featured: values.featured
  };
};
