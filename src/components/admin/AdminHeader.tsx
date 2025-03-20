
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminHeader: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium">Reserv</h1>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Accueil
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
