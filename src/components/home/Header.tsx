
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
    <header className="border-b border-gold/30 py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-gold">Restaurant Gourmet</h1>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-gold hover:bg-darkblack hover:text-gold" aria-label="Menu principal">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0 bg-darkblack border-l border-gold/30">
              <MobileNav />
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-cream hover:text-gold hover:bg-transparent font-light tracking-wide uppercase text-xs link-hover">
                Accueil
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="ghost" size="sm" className="text-cream hover:text-gold hover:bg-transparent font-light tracking-wide uppercase text-xs link-hover">
                Menu
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="sm" className="text-cream hover:text-gold hover:bg-transparent font-light tracking-wide uppercase text-xs link-hover">
                Événements
              </Button>
            </Link>
            <Link to="/reservations">
              <Button variant="ghost" size="sm" className="text-cream hover:text-gold hover:bg-transparent font-light tracking-wide uppercase text-xs link-hover">
                Réservations
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm" className="text-cream hover:text-gold hover:bg-transparent font-light tracking-wide uppercase text-xs link-hover">
                Contact
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
