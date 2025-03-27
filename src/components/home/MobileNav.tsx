
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Accueil", delay: 0 },
    { path: "/menu", label: "Menu", delay: 1 },
    { path: "/events", label: "Événements", delay: 2 },
    { path: "/reservations", label: "Réservations", delay: 3 },
    { path: "/contacts", label: "Contacts", delay: 4 }
  ];

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-md">
      <div className="px-6 py-8 border-b">
        <h2 className="text-xl font-medium opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>Restaurant Gourmet</h2>
        <p className="text-muted-foreground text-sm mt-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Cuisine française raffinée</p>
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li 
                key={item.path}
                className="opacity-0 animate-fade-in"
                style={{ 
                  animationDelay: `${0.2 + (index * 0.1)}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <SheetClose asChild>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-4 text-base rounded-md touch-manipulation
                      transition-all duration-300 hover:bg-primary/10
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
      
      <div className="mt-auto border-t px-6 py-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
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
