
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";
import { BookOpen, Cake, CalendarIcon } from "lucide-react";

const AdminMobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/menu-admin", label: "Menu", icon: BookOpen },
    { path: "/events-admin", label: "Événements", icon: Cake },
    { path: "/admin", label: "Réservations", icon: CalendarIcon }
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-8 border-b">
        <h2 className="text-xl font-medium">Reserv</h2>
        <p className="text-muted-foreground text-sm mt-1">Administration</p>
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
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
                    <Icon className="mr-3 h-5 w-5" />
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
          Panneau d'administration
        </p>
      </div>
    </div>
  );
};

export default AdminMobileNav;
