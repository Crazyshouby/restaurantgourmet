
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">Restaurant Gourmet</h1>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Menu principal">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="ghost" size="sm">
                Menu
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="sm">
                Événements
              </Button>
            </Link>
            <Link to="/reservations">
              <Button variant="ghost" size="sm">
                Réservations
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="ghost" size="sm">
                Contacts
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
