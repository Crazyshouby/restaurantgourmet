
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Restaurant Gourmet</h3>
            <p className="text-muted-foreground">
              Une expérience culinaire unique au cœur de Paris.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Horaires</h3>
            <p className="text-muted-foreground">
              Ouvert tous les jours<br />
              Déjeuner : 12h - 14h30<br />
              Dîner : 19h - 22h30
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <p className="text-muted-foreground">
              123 Rue de l'Étoile<br />
              Verdun, QC, H4G 2T7<br />
              (514) 555-1234
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Restaurant Gourmet. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
