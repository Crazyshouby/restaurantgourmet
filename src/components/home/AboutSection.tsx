
import React from "react";

const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-skyBlue/10 to-sageGreen/10 dark:from-skyBlue/5 dark:to-sageGreen/5">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-[1.02] animate-on-scroll">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Notre chef" 
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
          </div>
          
          <div className="space-y-6 animate-on-scroll">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              Notre histoire
            </span>
            <h2 className="text-3xl font-medium">Une passion pour la gastronomie</h2>
            <p className="paragraph">
              Depuis 15 ans, notre chef étoilé met son savoir-faire au service d'une cuisine créative
              et respectueuse des traditions. Chaque plat raconte une histoire, celle de producteurs
              passionnés et d'une équipe dévouée à l'excellence culinaire.
            </p>
            <p className="paragraph">
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
