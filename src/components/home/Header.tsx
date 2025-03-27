
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse-subtle">
          Restaurant Gourmet
        </h1>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 relative overflow-hidden group" 
                  aria-label="Menu principal"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 absolute transition-all duration-300 rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100" />
                  ) : (
                    <Menu className="h-6 w-6 transition-all duration-300 group-hover:scale-110" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0 glass border-0">
                <MobileNav />
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-animated relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Accueil
                </Button>
              </Link>
              <Link to="/menu">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-animated relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Menu
                </Button>
              </Link>
              <Link to="/events">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-animated relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Événements
                </Button>
              </Link>
              <Link to="/reservations">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-animated relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Réservations
                </Button>
              </Link>
              <Link to="/contacts">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="btn-animated relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  Contacts
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
