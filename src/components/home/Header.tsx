
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">Restaurant Gourmet</h1>
        <nav className="flex items-center gap-4">
          <Link to="/menu">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </Link>
          <Link to="/reservations">
            <Button variant="ghost" size="sm">
              Réservations
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              Administration
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
