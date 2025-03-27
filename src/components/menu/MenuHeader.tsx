
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const MenuHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-8 md:mb-12 px-4">
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block">
        Gastronomie française
      </span>
      <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-medium mt-3 mb-3 md:mb-4`}>Notre carte</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
        Découvrez nos créations culinaires élaborées avec des produits frais et de saison.
        {!isMobile && " Notre chef s'inspire des traditions françaises tout en y apportant une touche de modernité."}
      </p>
    </div>
  );
};

export default MenuHeader;
