
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/menu", label: "Menu" },
    { path: "/events", label: "Événements" },
    { path: "/reservations", label: "Réservations" },
    { path: "/contact", label: "Contact" }
  ];

  return (
    <div className="h-full flex flex-col bg-darkblack text-cream">
      <div className="px-6 py-10 border-b border-gold/30">
        <h2 className="text-xl font-serif text-gold">Restaurant Gourmet</h2>
        <p className="text-cream/70 text-sm mt-2 font-light">Cuisine française raffinée</p>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <SheetClose asChild>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-4 text-base rounded-md touch-manipulation
                      ${isActive 
                        ? "text-gold border-l-2 border-gold pl-3" 
                        : "text-cream/80 hover:text-gold"}
                        font-light tracking-wide
                    `}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto border-t border-gold/30 px-6 py-6">
        <p className="text-sm text-cream/70 font-light">
          Ouvert du mardi au dimanche
          <br />
          12h - 14h | 19h - 22h
        </p>
      </div>
    </div>
  );
};

export default MobileNav;
