
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/menu", label: "Menu" },
    { path: "/events", label: "Événements" },
    { path: "/reservations", label: "Réservations" },
    { path: "/contacts", label: "Contacts" }
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-8 border-b">
        <h2 className="text-xl font-medium">Restaurant Gourmet</h2>
        <p className="text-muted-foreground text-sm mt-1">Cuisine française raffinée</p>
      </div>
      
      <nav className="flex-1 px-2 py-4">
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
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"}
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
      
      <div className="mt-auto border-t px-6 py-6">
        <p className="text-sm text-muted-foreground">
          Ouvert du mardi au dimanche
          <br />
          12h - 14h | 19h - 22h
        </p>
      </div>
    </div>
  );
};

export default MobileNav;
