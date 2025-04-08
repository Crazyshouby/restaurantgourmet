
import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="border-t border-gold/30 bg-darkblack">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-serif mb-6 text-gold">Restaurant Gourmet</h3>
            <p className="text-cream/70 font-light leading-relaxed">
              Une expérience culinaire unique au cœur de Paris.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-6 text-gold">Horaires</h3>
            <p className="text-cream/70 font-light leading-relaxed">
              Ouvert tous les jours<br />
              Déjeuner : 12h - 14h30<br />
              Dîner : 19h - 22h30
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-6 text-gold">Contact</h3>
            <p className="text-cream/70 font-light leading-relaxed">
              123 Rue de l'Étoile<br />
              Verdun, QC, H4G 2T7<br />
              (514) 555-1234
            </p>
          </div>
        </div>
        
        <Separator className="my-10 bg-gold/20" />
        
        <div className="text-center text-sm text-cream/50 font-light">
          <p>© {new Date().getFullYear()} Restaurant Gourmet. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
