
export type MenuCategory = "Entrées" | "Plats" | "Desserts" | "Boissons" | "Apéritifs";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  featured?: boolean;
}
