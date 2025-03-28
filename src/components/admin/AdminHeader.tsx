
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import AdminMobileNav from "./AdminMobileNav";
import { Clock } from "@/components/ui/Clock";
import { useAdminTheme } from "@/context/AdminThemeContext";

const AdminHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useAdminTheme();
  
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">Panneau de Configuration</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Clock />
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Menu d'administration">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
                <AdminMobileNav />
              </SheetContent>
            </Sheet>
          ) : (
            <Link to="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
