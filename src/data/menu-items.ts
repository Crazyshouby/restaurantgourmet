
import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  // Entrées
  {
    id: "e1",
    name: "Foie Gras Maison",
    description: "Foie gras de canard fait maison, chutney de figues et pain d'épices toasté",
    price: 22.50,
    category: "Entrées",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "e2",
    name: "Carpaccio de Saint-Jacques",
    description: "Fines tranches de Saint-Jacques, huile d'olive citronnée, fleur de sel et poivre du moulin",
    price: 19.80,
    category: "Entrées",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2a49f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "e3",
    name: "Velouté de Champignons",
    description: "Crème de champignons de saison, huile de truffe et croutons à l'ail",
    price: 14.50,
    category: "Entrées",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "e4",
    name: "Salade de Chèvre Chaud",
    description: "Mesclun, toast de chèvre, miel, noix et vinaigrette balsamique",
    price: 16.20,
    category: "Entrées",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },

  // Plats
  {
    id: "p1",
    name: "Filet de Bœuf Rossini",
    description: "Filet de bœuf, escalope de foie gras poêlée, sauce aux truffes et pommes fondantes",
    price: 38.90,
    category: "Plats",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "p2",
    name: "Magret de Canard",
    description: "Magret de canard rôti, sauce au miel et agrumes, purée de patates douces",
    price: 28.50,
    category: "Plats",
    image: "https://images.unsplash.com/photo-1619221882266-c9745a722f0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p3",
    name: "Saint-Jacques à la Plancha",
    description: "Noix de Saint-Jacques, risotto crémeux aux asperges et parmesan",
    price: 32.70,
    category: "Plats",
    image: "https://images.unsplash.com/photo-1560963805-6c64417e3413?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "p4",
    name: "Suprême de Volaille",
    description: "Suprême de volaille fermière, jus réduit aux morilles, écrasé de pommes de terre à l'huile d'olive",
    price: 26.90,
    category: "Plats",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },

  // Desserts
  {
    id: "d1",
    name: "Fondant au Chocolat",
    description: "Cœur coulant au chocolat noir grand cru, glace vanille bourbon",
    price: 13.50,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1611329695518-1763fc1fcb7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "d2",
    name: "Crème Brûlée",
    description: "Crème à la vanille de Madagascar caramélisée",
    price: 12.80,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "d3",
    name: "Tarte Tatin",
    description: "Tarte aux pommes caramélisées, crème fraîche d'Isigny",
    price: 11.90,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "d4",
    name: "Assiette de Fromages",
    description: "Sélection de fromages affinés et pain aux céréales",
    price: 14.50,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1505575967455-40e256f73376?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },

  // Boissons
  {
    id: "b1",
    name: "Vin Rouge - Bordeaux",
    description: "Château Margaux, Grand Cru Classé, notes de fruits noirs et d'épices",
    price: 12.50,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "b2",
    name: "Vin Blanc - Bourgogne",
    description: "Chablis Premier Cru, arômes de fruits blancs et minéralité",
    price: 11.80,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1556269923-e4ef51d69638?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "b3",
    name: "Champagne",
    description: "Champagne Brut, notes d'agrumes et de brioche",
    price: 15.90,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1550106011-81f1a801964a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "b4",
    name: "Eau Minérale",
    description: "Eau de source naturelle, plate ou gazeuse",
    price: 5.50,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1564419188205-4a8694f9eb51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },

  // Apéritifs
  {
    id: "a1",
    name: "Kir Royal",
    description: "Champagne et crème de cassis",
    price: 14.50,
    category: "Apéritifs",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "a2",
    name: "Cocktail Maison",
    description: "Cocktail signature du chef barman, à base de gin et herbes fraîches",
    price: 16.20,
    category: "Apéritifs",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "a3",
    name: "Plateau de Charcuterie",
    description: "Sélection de charcuteries fines et cornichons",
    price: 19.80,
    category: "Apéritifs",
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "a4",
    name: "Olives Marinées",
    description: "Olives vertes et noires marinées aux herbes de Provence",
    price: 8.90,
    category: "Apéritifs",
    image: "https://images.unsplash.com/photo-1505070124728-0ae84847584e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];
