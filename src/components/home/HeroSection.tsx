
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-24 px-4 bg-darkblack relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <span className="inline-block px-4 py-1 border border-gold text-gold text-xs tracking-widest uppercase">
              Une expérience inoubliable
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-cream">
              Découvrez une <span className="text-gold italic">cuisine d'exception</span>
            </h2>
            <p className="text-cream/80 text-lg font-light leading-relaxed max-w-xl">
              Notre chef vous propose une carte élaborée avec des produits frais et de saison,
              pour une expérience culinaire unique.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <Link to="/reservations">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-darkblack rounded-none px-8 font-light tracking-wide text-sm group">
                  Réserver une table 
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10 rounded-none px-8 font-light tracking-wide text-sm">
                  Voir le menu
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block ml-auto">
            <div className="relative">
              <div className="absolute -inset-4 border border-gold/30 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Plat gastronomique" 
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
