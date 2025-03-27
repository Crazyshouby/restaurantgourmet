
import React from "react";

const MenuHeader: React.FC = () => {
  return (
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
  );
};

export default MenuHeader;
