
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Une expérience inoubliable
            </span>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight">
              Découvrez une cuisine d'exception
            </h2>
            <p className="text-muted-foreground text-lg">
              Notre chef vous propose une carte élaborée avec des produits frais et de saison,
              pour une expérience culinaire unique.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/reservations">
                <Button size="lg" className="gap-2">
                  Réserver une table <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" size="lg">
                  Voir le menu
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Plat gastronomique" 
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
