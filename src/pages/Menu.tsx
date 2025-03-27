import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { MenuCategory, MenuItem } from "@/types/menu";
import { menuItems } from "@/data/menu-items";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Euro } from "lucide-react";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "Tous">("Tous");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "Tous") {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-medium">Restaurant Gourmet</h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
            <Link to="/reservations">
              <Button variant="ghost" size="sm">
                Réservations
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                Administration
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 animate-fade-in">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
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
                    {item.price.toFixed(2)} <Euro className="ml-1 h-4 w-4" />
                  </span>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto py-6 px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Restaurant Gourmet. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
