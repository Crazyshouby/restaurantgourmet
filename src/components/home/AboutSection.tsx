
import React from "react";
import { Separator } from "@/components/ui/separator";

const AboutSection = () => {
  return (
    <section className="py-24 px-4 bg-muted">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute -inset-4 border border-gold/30 -z-10 translate-x-6 translate-y-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Notre chef" 
                className="w-full h-[450px] object-cover border border-gold/10"
              />
            </div>
          </div>
          
          <div className="space-y-6 order-1 md:order-2">
            <span className="inline-block px-4 py-1 border border-gold text-gold text-xs tracking-widest uppercase">
              Notre histoire
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-gold">Une passion pour la gastronomie</h2>
            <Separator className="w-16 h-[1px] bg-gold/50 my-6" />
            <p className="text-cream/80 font-light leading-relaxed">
              Depuis 15 ans, notre chef étoilé met son savoir-faire au service d'une cuisine créative
              et respectueuse des traditions. Chaque plat raconte une histoire, celle de producteurs
              passionnés et d'une équipe dévouée à l'excellence culinaire.
            </p>
            <p className="text-cream/80 font-light leading-relaxed">
              Venez découvrir notre carte qui évolue au fil des saisons et laissez-vous tenter par
              notre menu dégustation pour une expérience complète.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
